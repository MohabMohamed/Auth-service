const { DataTypes } = require('sequelize')
const sequelize = require('../db/db')
const bcrypt = require('bcryptjs')
const { v4: uuid } = require('uuid')
const basicRoles = require('../util/basicRoles')
const userError = require('../errors/userError')
const jwt = require('../util/jwt')

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    firstName: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: basicRoles.regular.id
    }
  },
  {
    tableName: 'User',
    hooks: {
      beforeSave: async (user, options) => {
        user.email = user.email.toLowerCase()
        user.password = await bcrypt.hash(user.password, 10)
      },
      beforeUpdate: async (user, options) => {
        user.email = user.email.toLowerCase()
        const { _previousDataValues, dataValues } = user
        if (
          await !bcrypt.compare(
            dataValues.password,
            _previousDataValues.password
          )
        ) {
          user.password = await bcrypt.hash(user.password, 10)
        }
      }
    }
  }
)

User.findByCredentials = async (email, password, transaction) => {
  const user = await User.findOne({
    where: {
      email
    },
    transaction
  })

  if (!user) {
    throw userError.unableToLogin()
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    throw userError.unableToLogin()
  }

  return user
}

User.prototype.toJSON = function () {
  const newUser = Object.assign({}, this.dataValues)

  if (newUser.password) {
    delete newUser.password
  }

  if (newUser.refreshToken) {
    delete newUser.refreshToken
  }

  if (newUser.createdAt) {
    delete newUser.createdAt
  }

  if (newUser.updatedAt) {
    delete newUser.updatedAt
  }

  return newUser
}

User.prototype.generateAccessToken = function () {
  const { id, roleId, firstName, lastName, email } = this.dataValues

  return jwt.sign(
    {
      id,
      roleId,
      firstName,
      lastName,
      email
    },
    process.env.ACCESS_JWT_SECRET,
    Number(process.env.ACCESS_TOKEN_LIFE_SPAN)
  )
}

User.generateRefreshToken = function () {
  return jwt.sign(
    { session: uuid() },
    process.env.REFRESH_JWT_SECRET,
    Number(process.env.REFRESH_TOKEN_LIFE_SPAN)
  )
}

User.register = async (userData, transaction) => {
  // remove roleId and id if they present in the request
  const { roleId, id, ...user } = Object.assign({}, userData)

  const matchedUser = await User.findOne({
    where: {
      email: user.email
    },
    transaction
  })

  if (matchedUser) {
    throw userError.existingEmail()
  }

  const refreshToken = User.generateRefreshToken()

  try {
    const newUser = await User.create(
      {
        ...user,
        refreshToken: { token: refreshToken }
      },
      {
        include: ['refreshToken'],
        transaction
      }
    )
    return newUser
  } catch (error) {
    throw userError.unableToRegister()
  }
}

User.associate = models => {
  User.hasMany(models.RefreshToken, {
    foreignKey: 'userId',
    as: 'refreshToken',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  })

  User.belongsTo(models.Role, {
    foreignKey: 'roleId',
    as: 'role',
    onUpdate: 'CASCADE',
    onDelete: 'SET DEFAULT'
  })
}

module.exports = User
