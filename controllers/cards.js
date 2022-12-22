const Card = require('../modeles/card'); // импорт моделе с соответствующей схемой
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

const {
  OK,
  CREATED,
  ERROR_400,
  ERROR_403,
  ERROR_404,
} = require('../constants');

// сработает при GET-запросе на URL '/cards' - возвращает все карточки
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.status(OK).send(cards))
    .catch(err => next(err));
};

// сработает при POST-запросе на URL '/cards' - добавляет карточку
module.exports.createCard = (req, res, next) => {
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
      if (err.name === 'ValidationError') {
        next(new BadRequestError(ERROR_400));
      } else {
        next(err);
      }
    });
};

// сработает при DELETE-запросе на URL '/cards/:cardId' - удаляет карточку по идентификатору
module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError(ERROR_404);
      }
      // запрещаем пользователю удалять чужие карточки
      if (!card.owner._id.equals(req.user._id)) {
        throw new ForbiddenError(ERROR_403);
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
      if (err.name === 'CastError') {
        next(new BadRequestError(ERROR_400));
      } else {
        next(err);
      }
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
        throw new NotFoundError(ERROR_404);
      };
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
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError(ERROR_400));
      } else {
        next(err);
      }
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
        throw new NotFoundError(ERROR_404);
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
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next (new BadRequestError(ERROR_400));
      } else {
        next(err);
      }
    });
};
