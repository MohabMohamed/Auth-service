const { DataTypes } = require('sequelize')
const sequelize = require('../db/db')
const basicRoles = require('../util/basicRoles')

const Role = sequelize.define(
  'Role',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    roleName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    }
  },
  {
    tableName: 'Role'
  }
)

Role.insertBasicRoles = async () => {
  const data = Object.values(basicRoles)
  await Role.bulkCreate(data, { ignoreDuplicates: true })
}

Role.associate = models => {
  Role.hasMany(models.User, {
    foreignKey: 'roleId',
    as: 'user',
    onUpdate: 'CASCADE',
    onDelete: 'SET DEFAULT'
  })

  Role.hasMany(models.Permission, {
    foreignKey: 'roleId',
    as: 'permission',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  })
}

module.exports = Role
