const { DataTypes } = require('sequelize')
const sequelize = require('../db/db')
const bcrypt = require('bcryptjs')
const basicRoles = require('../util/basicRoles')
const userError = require('../errors/userError')

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

User.findByCredentials = async (email, password) => {
  const user = await User.findOne({
    where: {
      email
    }
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

  return newUser
}

User.associate = models => {
  User.hasMany(models.RefreshToken, {
    foreignKey: 'userId',
    as: 'refreshToken',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  })

  User.belongsTo(models.role, {
    foreignKey: 'roleId',
    as: 'role',
    onUpdate: 'CASCADE',
    onDelete: 'SET DEFAULT'
  })
}
