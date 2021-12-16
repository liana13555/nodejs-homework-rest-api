const { NotFound } = require('http-errors')
const { User } = require('../../models')

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params // Что написано в маршруте через двоеточие хранится в req.params
  const user = User.findOne({ verificationToken }) // Есть ли в базе токен с таким verificationToken
  if (!user) {
    throw NotFound('User not found')
  }
  await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: null })
  res.json({
    status: 'success',
    code: 200,
    message: 'Verification successful'
  })
}

module.exports = verifyEmail
