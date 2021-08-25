const { DataTypes } = require('sequelize')
const sequelize = require('../db/db')

const Permission = sequelize.define(
  'Permission',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    httpMethod: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    tableName: 'Permission'
  }
)

Permission.associate = models => {
  Permission.belongsTo(models.Role, {
    foreignKey: 'roleId',
    as: 'role',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  })
}

module.exports = Permission
