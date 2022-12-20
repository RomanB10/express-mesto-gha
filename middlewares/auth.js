const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = require('../constants');

module.exports = (req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization } = req.headers;
  console.log('В auth authorization ЭТО:', authorization);

  // убеждаемся, что он есть или начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Необходима авторизацияzzzzz' });
  }

  // извлечём токен
  const token = authorization.replace('Bearer ', '');
  console.log('Извлекли TOKEN:', token);
  let payload;

  try {
    // верифицируем токен
    payload = jwt.verify(token, JWT_SECRET_KEY);
    console.log('PAYLOAD-', payload);
  } catch (err) {
    // отправим ошибку, если не получилось

    return res.status(401).send({ message: 'Необходима автор' });
  }

  req.user = payload; // записываем пейлоуд в объект запроса
  console.log('ЗАПИСАЛИ REQ.USER-', req.user._id);

  next(); // пропускаем запрос дальше
};
