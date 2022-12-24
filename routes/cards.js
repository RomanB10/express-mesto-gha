const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { isObjectIdOrHexString } = require('mongoose');// метод из библиотеки mongoose для валидации id
const isURL = require('validator/lib/isURL');// валидаия URL
Joi.objectId = require('joi-objectid')(Joi);// пакет для валидации id
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  disLikeCard,
} = require('../controllers/cards');

// сработает при GET-запросе на URL '/cards' - возвращает все карточки
router.get('/', getCards);

// сработает при POST-запросе на URL '/cards' - добавляет карточку
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required()
      .custom((value, helpers) => {
        if (isURL(value)) {
          return value;
        }
        return helpers.message('Некорректный URL');
      }), // кастомная валидация
  }),
}), createCard);

// сработает при DELETE-запросе на URL '/cards/:cardId' - удаляет карточку по идентификатору
router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required()
      .custom((value, helpers) => {
        if (isObjectIdOrHexString(value)) {
          return value;
        }
        return helpers.message('Передан невалидный id');
      }), // кастомная валидация с помощью метода из библиотеки mongoose
  }),
}), deleteCard);

// сработает при PUT-запросе на URL '/cards/:cardId/likes' - поставить лайк карточке
router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().alphanum().length(24), // валидация с помощью встроенного hex
  }),
}), likeCard);

// сработает при DELETE-запросе на URL '/cards/:cardId/likes' - удалить лайк с карточки
router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.objectId(), // валидация с помощью пакета 'joi-objectid'
  }),
}), disLikeCard);
module.exports = router;
