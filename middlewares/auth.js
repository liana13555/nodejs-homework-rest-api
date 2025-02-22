/*
Извлекает токен из заголовка и:
1. Проверяет валидность токена (т.е. что мы его выдали и он не истек).
2. Извлекает из токена id, находит пользователя в базе по id и прикрепляет его к запросу (req.user).
*/

/*
1. Извлечь из заголовков запроса содержимое заголовка Authorization(Postman)
2. Разделисть его на 2 слова: Bearer и токен.
3. Проверить равно ли первое слово "Bearer".
4. Проверить валидность второго слова (токен).
5. Если токен валиден - извлечь из него id и найти пользователя в базе с таким id.
6. Если пользователя с таким id мы нашли в базе - его нужно прикрепить к запросу (объект req).
*/

const { Unauthorized } = require('http-errors')
const jwt = require('jsonwebtoken')

const { User } = require('../models')

const { SECRET_KEY } = process.env

const auth = async (req, res, next) => {
  const { authorization = '' } = req.headers
  const [bearer, token] = authorization.split(' ')
  try {
    if (bearer !== 'Bearer') {
      throw new Unauthorized('Not authorized')
    }
    const { id } = jwt.verify(token, SECRET_KEY)
    const user = await User.findById(id)
    if (!user || !user.token) {
      throw new Unauthorized('Not authorized')
    }
    req.user = user
    next()
  } catch (error) {
    if (error.message === 'Invalid signature') {
      error.status = 401
    }
    next(error)
  }
}

module.exports = auth
