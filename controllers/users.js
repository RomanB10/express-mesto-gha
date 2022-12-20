const bcrypt = require('bcryptjs'); // используем модуль для хеширования пароля
const jwt = require('jsonwebtoken'); //
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
  MONGO_DUPLICATE_ERROR_CODE,
  SOLT_ROUNDS,
  JWT_SECRET_KEY
} = require('../constants');

// сработает при GET-запросе на URL '/users' - возвращает всех пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(OK).send(users))
    .catch(() => {
      res.status(SERVER_ERROR).send({ message: ERROR_500 });
    });
};

// сработает при GET-запросе на URL '/users/me' - получить информацию о текущем пользователе
module.exports.getCurrentUser = (req, res) => {
  console.log('req.user._id ЭТО: ', req.user._id);
  User.findById(req.user._id)
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

// сработает при POST-запросе на URL '/signup',
module.exports.createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;
  console.log('Тело запроса:', req.body);
  console.log({ name, about, avatar, email, password });
  if (!email || !password) {
    return res.status(401).send({ message: "Не передан email или pasword" });
  }
  /*const newUser =  User.findOne(email);
  console.log(newUser);
   if (newUser){
    return res.status(409).send({ message: "Такой пользователь уже существует" });
   }*/
     bcrypt.hash(req.body.password, SOLT_ROUNDS)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    })
      .then((user) => {
        console.log('Пароль в ответе захеширован:', user.password);
        res.status(CREATED).send({
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          _id: user._id,
          email: user.email,
          password: user.password,
        });
      }))
    .catch((err) => {
      console.log(err)
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUSET).send({ message: ERROR_400 });
        return;
      }
      res.status(SERVER_ERROR).send({ message: ERROR_500 });
    });
};

// сработает при POST-запросе на URL '/signin', аутентификация пользователя
module.exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(401).send({ message: 'Не правильные email или pasword' });
  }
  console.log('Тело запроса signin:', req.body);
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна
      // создаем токен
      console.log('user._id:', user._id)
      const token = jwt.sign({ _id: user._id }, JWT_SECRET_KEY, { expiresIn: '7d' });

      console.log('CОХРАНИЛИ PAYLOAD:', token);
      // вернём токен
      res.status(200).send({ token });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send({ message: 'Не удалось авторизоваться' });
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


/*
// сработает при POST-запросе на URL '/users' - добавляет пользователя
module.exports.createUser = async (req, res) => {
  const { name, about, avatar, email, password } = req.body;
  console.log('Тело запроса:', req.body);
  console.log({name, about, avatar, email, password });

  if (!email || !password) {
    res.status(401).send({ message: "Не передан email или pasword" });
  }

  try {
    const hash = await bcrypt.hash(password, SOLT_ROUNDS);
    const newUser = await User.create({name, about, avatar, email, password: hash,});
  if (newUser) {
    res.status(201).send(newUser);
  }

  } catch(err) {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUSET).send({ message: ERROR_400 });
        return;
      }
      if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
        res.status(409).send({ message: "Такой пользователь уже существует" });
        return;
      }
      return res.status(SERVER_ERROR).send({ message: ERROR_500 });
    };
};
*/

/*
module.exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(401).send({ message: "Не правильные email или pasword" });
  }
  console.log('Тело запроса signin:', req.body);
  User.findOne({ email })
    .then((user) => {
      console.log("Проверям что есть User-", user);
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      console.log('Перед сравнением пароля '+password, 'Пароль в базе '+user.password);
      console.log("user._id:",user._id)
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      console.log( 'ПАРОЛИ СОВПАЛИ?: ', matched );
      if (!matched) {
        // хеши не совпали — отклоняем промис
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      // аутентификация успешна
      // создаем токен
      console.log("user._id:",user._id)
      const token = jwt.sign({ _id: user._id }, JWT_SECRET_KEY, { expiresIn: '7d' });
      console.log('CОХРАНИЛИ в пэйлод _id token:', token)
      // вернем токен
        res.status(200).send({ message: "Записали токен", token });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send({ message: "Не удалось авторизоваться" });
    });
};
*/