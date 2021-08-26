const User = require('../../src/models/user')
const basicRoles = require('../../src/util/basicRoles')
const db = require('../../src/db/index')
const RefreshToken = require('../../src/models/refresh-token')
const Role = require('../../src/models/role')
const { Op } = require('sequelize')

const firstUserId = 1
const firstUser = {
  id: firstUserId,
  roleId: basicRoles.superAdmin.id,
  firstName: 'mohab',
  lastName: 'Abd El-Dayem',
  email: 'test@gmail.com',
  password: '1234b0i@(bvw',
  phoneNumber: '01048486'
}

const secondUserId = 2
const secondUser = {
  id: secondUserId,
  roleId: basicRoles.regular.id,
  firstName: 'elon',
  lastName: 'musk',
  email: 'elon@spacex.com',
  password: '1234b0i@(bvw',
  phoneNumber: '01048486'
}

const firstRefreshToken = User.generateRefreshToken()
const secondRefreshToken = User.generateRefreshToken()

const setupDatabase = async () => {
  await User.destroy({ where: {} })
  await RefreshToken.destroy({ where: {} })

  const basicRolesNames = [
    basicRoles.admin.roleName,
    basicRoles.superAdmin.roleName,
    basicRoles.regular.roleName]
  await Role.destroy({ where: { roleName: { [Op.notIn]: basicRolesNames } } })

  firstUser.refreshToken = { token: firstRefreshToken }

  await User.create(firstUser, {
    include: ['refreshToken']
  })

  secondUser.refreshToken = { token: secondRefreshToken }

  await User.create(secondUser, {
    include: ['refreshToken']
  })
}

const cleanDB = async () => {
  db.sequelize.close()
}

module.exports = {
  firstUser,
  firstUserId,
  firstRefreshToken,
  secondUser,
  secondUserId,
  secondRefreshToken,
  setupDatabase,
  cleanDB
}
