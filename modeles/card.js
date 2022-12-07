const mongoose = require('mongoose');
//опишем схему
const cardSchema = new mongoose.Schema({
name: {
  type: String,
  required: true,
  minlength: 2,
  maxlength: 30,
},
link:{
  type: String,
  required: true,
},
owner:{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'user',
  required: true
},
likes:{
  type: Array,
  required: true,
  default : []
},
createdAt:{
  type: Date,
  required: true,
  default : Date.now
}
})

//создадим модель и экспортируем ее
module.exports = mongoose.model('card', cardSchema);
