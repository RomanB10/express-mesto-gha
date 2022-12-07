const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Слушаем 3000 порт
const { PORT = 3000, BASE_PATH } = process.env;
//создаем сервер
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb',{
  /*useNewUrlParser: true,
  useCreateIndex: true,
    useFindAndModify: false*/
}, err => {
  if(err) throw err;
  console.log('Connected to MongoDB!!!')
})

//захардкодили идентификатор пользователя в мидлвэер
app.use((req,res,next)=>{
  req.user = {
    _id: "638e8ec0ac3f87d6eb625453"
  };

  next();
})

app.use('/users', require('./routes/users'));//Подключаем роутер пользователей
app.use('/cards', require('./routes/cards'))//Подключаем роутер карточек

app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, ()=>{
  console.log('Connected to:', PORT)
})












/*
app.get('/users',(req, res)=>{
 /* res.send(req.query)
  res.send('Проверили роут /users')
})

app.get('/users/:userId',(req, res)=>{
  res.send('Проверили роут /users/:userId')
})

app.post('/users',(req, res)=>{
  res.send('Проверили роут post /users')
})*/