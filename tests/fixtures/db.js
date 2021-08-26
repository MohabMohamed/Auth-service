const User = require('../../src/models/user')
const db = require('../../src/db/index')

const firstUser = {
  firstName: 'mohab',
  lastName: 'Abd El-Dayem',
  email: 'test@gmail.com',
  password: '1234b0i@(bvw',
  phoneNumber: '01048486'
}

const setupDatabase = async () => {
  await User.destroy({ where: {} })
  await User.create(firstUser)
}

const cleanDB = async () => {
  db.sequelize.close()
}

module.exports = { firstUser, setupDatabase, cleanDB }
