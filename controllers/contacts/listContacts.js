const { Contact } = require('../../models')

const listContacts = async (req, res) => {
  const { _id } = req.user
  const { page = 1, limit = 1 } = req.query
  const skip = (page - 1) * limit
  const contacts = await Contact.find({ owner: _id }, '', { skip, limit: Number(limit) }).populate('owner', '_id name email')

  res.json({
    status: 'success',
    code: 200,
    data: {
      result: contacts
    }
  })
}

module.exports = listContacts

/* "populate" - берет id из объекта и ищет в коллекции, к-рая указана в ref и в ответе этот объект записывает в поле
  skip: 2, limit: 2 - сколько объектов пропустить и сколько найти
*/
