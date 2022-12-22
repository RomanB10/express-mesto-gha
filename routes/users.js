const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  getUser,
  getCurrentUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

// сработает при GET-запросе на URL '/users' ,берем колбэк из контроллера
router.get('/', getUsers);

// сработает при GET-запросе на URL '/users/me' - получить информацию о текущем пользователе
router.get('/me', getCurrentUser);

// сработает при GET-запросе на URL '/users/:userId' - возвращает пользователя по _id
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  })}), getUser);

// сработает при PATCH-запросе на URL '/users/me' - обновляет профиль
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  })}), updateProfile);

// сработает при PATCH-запросе на URL '/users/me/avatar' - обновляет аватар
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().min(2),
  })}), updateAvatar);

module.exports = router;
