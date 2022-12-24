/* eslint-disable consistent-return */
const bcrypt = require('bcryptjs'); // используем модуль для хеширования пароля
const jwt = require('jsonwebtoken'); //
const User = require('../modeles/user'); // импорт моделе с соответствующей схемой
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const ConflictError = require('../errors/conflict-err');
const {
  OK,
  CREATED,
  ERROR_400,
  ERROR_404,
  MONGO_DUPLICATE_ERROR_CODE,
  SOLT_ROUNDS,
  JWT_SECRET_KEY,
} = require('../constants');

// сработает при GET-запросе на URL '/users' - возвращает всех пользователей
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(OK).send(users))
    .catch((err) => next(err));
};

// сработает при GET-запросе на URL '/users/me' - получить информацию о текущем пользователе
module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(ERROR_404);
      }
      res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(ERROR_400));
      } else {
        next(err);
      }
    });
};

// сработает при GET-запросе на URL '/users/:userId' - возвращает пользователя по _id
module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(ERROR_404);
      }
      res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(ERROR_400));
      } else {
        next(err);
      }
    });
};

// сработает при POST-запросе на URL '/signup' - добавляет пользователя
module.exports.createUser = async (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: 'Не переданы email или pasword' });
  }

  try {
    const hash = await bcrypt.hash(password, SOLT_ROUNDS);

    const newUser = await User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    });
    if (newUser) {
      return res.status(CREATED).send({
        name: newUser.name,
        about: newUser.about,
        avatar: newUser.avatar,
        email: newUser.email,
        id: newUser._id,
      });
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Не валидные email или pasword'));
    } else if (error.code === MONGO_DUPLICATE_ERROR_CODE) {
      next(new ConflictError('Такой пользователь уже существует'));
    } else {
      next(error);
    }
  }
};

// сработает при POST-запросе на URL '/signin', аутентификация пользователя
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new UnauthorizedError('Не правильные email или pasword');
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна
      // создаем токен
      const token = jwt.sign({ _id: user._id }, JWT_SECRET_KEY, {
        expiresIn: '7d',
      });
      // вернём токен
      res.status(200).send({ token });
    })
    .catch((err) => {
      next(err);
    });
};

// сработает при PATCH-запросе на URL '/users/me' - обновляет профиль
module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError(ERROR_404);
      }
      res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(ERROR_400));
      } else {
        next(err);
      }
    });
};

// сработает при PATCH-запросе на URL '/users/me/avatar' - обновляет аватар
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError(ERROR_404);
      }
      res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(ERROR_400));
      } else {
        next(err);
      }
    });
};
