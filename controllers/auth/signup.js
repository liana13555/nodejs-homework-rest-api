const { Conflict } = require('http-errors')
const gravatar = require('gravatar')
const { nanoid } = require('nanoid')

const { sendEmail } = require('../../helpers')
const { User } = require('../../models')

const signup = async (req, res) => {
  const { name, email, password } = req.body
  const user = await User.findOne({ email })
  if (user) {
    throw new Conflict(`User with ${email} already exist`)
  }

  const avatarURL = gravatar.url(email)
  const verificationToken = nanoid()
  const newUser = new User({ name, email, avatarURL, verificationToken })

  newUser.setPassword(password)

  await newUser.save()

  const mail = {
    to: email,
    subject: 'Подтверждение email',
    html: `<a target="_blank" href="http://localhost:3030/api/users/verify/${verificationToken}">Подтвердить email</a>` // target="_blank" - ссылка откроется в новом окне
  }

  await sendEmail(mail)

  res.status(201).json({
    status: 'success',
    code: 201,
    data: {
      user: {
        name,
        email,
        avatarURL,
        verificationToken
      }
    }
  })
}

module.exports = signup
