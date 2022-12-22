const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
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
    link: Joi.string().required(),
  })}), createCard);

// сработает при DELETE-запросе на URL '/cards/:cardId' - удаляет карточку по идентификатору
router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  })}), deleteCard);

// сработает при PUT-запросе на URL '/cards/:cardId/likes' - поставить лайк карточке
router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  })}), likeCard);

// сработает при DELETE-запросе на URL '/cards/:cardId/likes' - удалить лайк с карточки
router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  })}), disLikeCard);
module.exports = router;
