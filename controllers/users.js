const User = require('../modeles/user'); // импорт моделе с соответствующей схемой

const {
  BAD_REQUSET,
  NOT_FOUND,
  SERVER_ERROR,
  OK,
  CREATED,
  ERROR_400,
  ERROR_404,
  ERROR_500,
} = require('../constants');

// сработает при GET-запросе на URL '/users' - возвращает всех пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(OK).send(users))
    .catch(() => {
      res.status(SERVER_ERROR).send({ message: ERROR_500 });
    });
};

// сработает при GET-запросе на URL '/users/:userId' - возвращает пользователя по _id
module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND).send({ message: ERROR_404 });
        return;
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
        res.status(BAD_REQUSET).send({ message: ERROR_400 });
        return;
      }
      res.status(SERVER_ERROR).send({ message: ERROR_500 });
    });
};

// сработает при POST-запросе на URL '/users' - добавляет пользователя
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(CREATED).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUSET).send({ message: ERROR_400 });
        return;
      }
      res.status(SERVER_ERROR).send({ message: ERROR_500 });
    });
};

// сработает при PATCH-запросе на URL '/users/me' - обновляет профиль
module.exports.updateProfile = (req, res) => {
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
        res.status(NOT_FOUND).send({ message: ERROR_404 });
        return;
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
        res.status(BAD_REQUSET).send({ message: ERROR_400 });
        return;
      }
      res.status(SERVER_ERROR).send({ message: ERROR_500 });
    });
};

// сработает при PATCH-запросе на URL '/users/me/avatar' - обновляет аватар
module.exports.updateAvatar = (req, res) => {
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
        res.status(NOT_FOUND).send({ message: ERROR_404 });
        return;
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
        res.status(BAD_REQUSET).send({ message: ERROR_400 });
        return;
      }
      res.status(SERVER_ERROR).send({ message: ERROR_500 });
    });
};
