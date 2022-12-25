const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');// Валидация приходящих на сервер данных
const rateLimit = require('express-rate-limit');// Ограничение количества запросов,защита от Dos-атак
const helmet = require('helmet');// Защита от веб-уязвимостей, настройка Security-заголовков

mongoose.set('strictQuery', false);// чтобы работал dotenv

const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-err');
const CentralHandingError = require('./errors/CentralHandingError');

require('dotenv').config();// необходим, чтобы пользоваться окружением 'process.env'

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;
// создаем сервер
const app = express();

// Защита от Dos-атак
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // окно 15 минут
  max: 100, // ограничьте каждый IP-адрес 100 запросами на "окно" (здесь за 15 минут)
  standardHeaders: true, // Возвращает информацию об ограничении скорости в заголовках `RateLimit-*`
  legacyHeaders: false, // Отключите заголовки `X-RateLimit-*`
  message: 'Слишком много запросов с этого IP',
});

// Применить ограничение ко всем запросам
app.use(limiter);

// Защита всех заголовков
app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// подключаемся к серверу mongo
mongoose.connect(MONGO_URL, (err) => {
  if (err) throw err;
  console.log('Connected to MongoDB!!!');
});

// роуты, не требующие авторизации, с валидацией тела запроса средствами celebrate
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }).unknown(true),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }).unknown(true),
}), createUser);

// роуты, которым авторизация нужна
app.use('/users', auth, require('./routes/users')); // Подключаем роутер пользователей
app.use('/cards', auth, require('./routes/cards')); // Подключаем роутер карточек

// Мидлвара для обработки неизвестного маршрута
app.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

// обработчик ошибок celebrate
app.use(errors());

// здесь обрабатываем все ошибки
app.use(CentralHandingError);

// Слушаем 3000 порт
app.listen(PORT, (err) => {
  if (err) {
    console.log('Error while starting server');
  } else {
    console.log('Server has been started at port -', PORT);
  }
});
