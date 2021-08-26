const User = require('../../src/models/user')
const db = require('../../src/db/index')

const firstUser = {
  firstName: 'mohab',
  lastName: 'Abd El-Dayem',
  email: 'test@gmail.com',
  password: '1234b0i@(bvw',
  phoneNumber: '01048486'
}

const firstRefreshToken = User.generateRefreshToken()

const setupDatabase = async () => {
  await User.destroy({ where: {} })
  firstUser.refreshToken = { token: firstRefreshToken }

  await User.create(firstUser, {
    include: ['refreshToken']
  })
}

const cleanDB = async () => {
  db.sequelize.close()
}

module.exports = { firstUser, firstRefreshToken, setupDatabase, cleanDB }
