const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { NOT_FOUND } = require('./constants');

const { PORT = 3000 } = process.env;
// создаем сервер
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', (err) => {
  if (err) throw err;
  console.log('Connected to MongoDB!!!');
});

// захардкодили идентификатор пользователя в мидлвэер
app.use((req, res, next) => {
  req.user = {
    _id: '638e8ec0ac3f87d6eb625453',
  };

  next();
});

app.use('/users', require('./routes/users')); // Подключаем роутер пользователей
app.use('/cards', require('./routes/cards')); // Подключаем роутер карточек

app.use('*', (req, res, next) => {
  res.status(NOT_FOUND).send({ message: 'Страница не найдена' });

  next();
});

// Слушаем 3000 порт
app.listen(PORT, (err) => {
  if (err) {
    console.log('Error while starting server');
  } else {
    console.log('Server has been started at port -', PORT);
  }
});
