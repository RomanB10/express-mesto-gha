const router = require('express').Router();
const { getUsers, getUser, createUser, updateProfile, updateAvatar } = require('../controllers/users');


// сработает при GET-запросе на URL /users ,берем колбэк из контроллера
router.get('/', getUsers);

// сработает при GET-запросе на URL /users/:userId - возвращает пользователя по _id,берем колбэк из контроллера
router.get('/:userId', getUser);

// сработает при POST-запросе на URL /users,берем колбэк из контроллера
router.post('/', createUser);

// сработает при PATCH-запросе на URL '/users/me' - обновляет профиль
router.patch('/me', updateProfile)

// сработает при PATCH-запросе на URL '/users/me/avatar' - обновляет аватар
router.patch('/me/avatar', updateAvatar)


module.exports = router;