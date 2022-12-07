const router = require('express').Router();
const { getCards, createCard, deleteCard, likeCard,disLikeCard } = require('../controllers/cards');

// сработает при GET-запросе на URL /cards - возвращает всех пользователей
router.get('/', getCards);

// сработает при POST-запросе на URL /cards - добавляет пользователя
router.post('/', createCard);


// сработает при DELETE-запросе на URL /cards/:cardId - удаляет карточку по идентификатору
router.delete('/:cardId', deleteCard);

// сработает при PUT-запросе на URL '/cards/:cardId/likes' - поставить лайк карточке
router.put('/:cardId/likes', likeCard);

 // сработает при DELETE-запросе на URL '/cards/:cardId/likes' - удалить лайк с карточки
router.delete('/:cardId/likes', disLikeCard);
module.exports = router;