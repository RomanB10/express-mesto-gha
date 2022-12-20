const BAD_REQUSET = 400;
const NOT_FOUND = 404;
const SERVER_ERROR = 500;
const OK = 200;
const CREATED = 201;

const ERROR_400 = 'Переданы некорректные данные';
const ERROR_404 = 'Передан несуществующий _id';
const ERROR_500 = 'На сервере произошла ошибка';

const MONGO_DUPLICATE_ERROR_CODE = 11000;
const SOLT_ROUNDS = 10;
const JWT_SECRET_KEY = "verty_secret";

module.exports = {
  BAD_REQUSET,
  NOT_FOUND,
  SERVER_ERROR,
  OK,
  CREATED,
  ERROR_400,
  ERROR_404,
  ERROR_500,
  MONGO_DUPLICATE_ERROR_CODE,
  SOLT_ROUNDS,
  JWT_SECRET_KEY,
};
