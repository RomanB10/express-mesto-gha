const router = require('express').Router();
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
router.get('/:userId', getUser);

// сработает при PATCH-запросе на URL '/users/me' - обновляет профиль
router.patch('/me', updateProfile);

// сработает при PATCH-запросе на URL '/users/me/avatar' - обновляет аватар
router.patch('/me/avatar', updateAvatar);

module.exports = router;
