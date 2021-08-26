const User = require('../../src/models/user')
const db = require('../../src/db/index')
const RefreshToken = require('../../src/models/refresh-token')

const firstUserId = 1
const firstUser = {
  id: firstUserId,
  firstName: 'mohab',
  lastName: 'Abd El-Dayem',
  email: 'test@gmail.com',
  password: '1234b0i@(bvw',
  phoneNumber: '01048486'
}

const firstRefreshToken = User.generateRefreshToken()

const setupDatabase = async () => {
  await User.destroy({ where: {} })
  await RefreshToken.destroy({ where: {} })
  firstUser.refreshToken = { token: firstRefreshToken }

  await User.create(firstUser, {
    include: ['refreshToken']
  })
}

const cleanDB = async () => {
  db.sequelize.close()
}

module.exports = { firstUser, firstUserId, firstRefreshToken, setupDatabase, cleanDB }
