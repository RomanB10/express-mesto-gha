const Card = require('../modeles/card'); // импорт моделе с соответствующей схемой

const BAD_REQUSET = 400;
const NOT_FOUND = 404;
const SERVER_ERROR = 500;
const OK = 200;
const CREATED = 201;

const ERROR_400 = 'Переданы некорректные данные';
const ERROR_404 = 'Запрашиваемый пользователь не найден';
const ERROR_500 = 'Произошла ошибка';

// сработает при GET-запросе на URL /cards - возвращает всех пользователей
module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.status(OK).send(cards))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'BadRequest') {
        res.status(BAD_REQUSET).send({ message: ERROR_400 });
        return;
      }
      res.status(SERVER_ERROR).send({ message: ERROR_500 });
    });
};

// сработает при POST-запросе на URL '/cards' - добавляет карточку
module.exports.createCard = (req, res) => {
  const { name, link } = req.body; // получим из объекта запроса имя и ссылку
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(CREATED).send({
      likes: card.likes,
      _id: card._id,
      name: card.name,
      link: card.link,
      owner: card.owner,
      createdAt: card.createdAt,
    }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'BadRequest') {
        res.status(BAD_REQUSET).send({ message: ERROR_400 });
        return;
      }
      res.status(SERVER_ERROR).send({ message: ERROR_500 });
    });
};

// сработает при DELETE-запросе на URL '/cards/:cardId' - удаляет карточку по идентификатору
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND).send({ message: ERROR_404 });
        return;
      }
      res.send({
        likes: card.likes,
        _id: card._id,
        name: card.name,
        link: card.link,
        owner: card.owner,
        createdAt: card.createdAt,
      });
    })
    .catch(() => {
      res.status(SERVER_ERROR).send({ message: ERROR_500 });
    });
};

// сработает при PUT-запросе на URL '/cards/:cardId/likes' - поставить лайк карточке
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    {
      new: true,
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND).send({ message: ERROR_404 });
        return;
      }
      res.send({
        likes: card.likes,
        _id: card._id,
        name: card.name,
        link: card.link,
        owner: card.owner,
        createdAt: card.createdAt,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'BadRequest') {
        res.status(BAD_REQUSET).send({ message: ERROR_400 });
        return;
      }
      res.status(SERVER_ERROR).send({ message: ERROR_500 });
    });
};

// сработает при DELETE-запросе на URL '/cards/:cardId/likes' - удалить лайк с карточки
module.exports.disLikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND).send({ message: ERROR_404 });
        return;
      }
      res.send({
        likes: card.likes,
        _id: card._id,
        name: card.name,
        link: card.link,
        owner: card.owner,
        createdAt: card.createdAt,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'BadRequest') {
        res.status(BAD_REQUSET).send({ message: ERROR_400 });
        return;
      }
      res.status(SERVER_ERROR).send({ message: ERROR_500 });
    });
};
