const fs = require('fs')
const path = require('path')
const sequelize = require('./db')
const modelsDirPath = path.join(__dirname, '../models')

const models = {}

// including all models' files in the models directory
fs.readdirSync(modelsDirPath)
  .filter(file => file.indexOf('.') !== 0 && file.slice(-3) === '.js')
  .forEach(file => {
    const model = require(path.join(modelsDirPath, file))
    models[model.name] = model
  })

// building the associations between models
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models)
  }
})

const getTransaction = async () => {
  return sequelize.transaction()
}

const rollBackTransaction = async transaction => {
  return transaction.rollback()
}

const commitTransaction = async transaction => {
  return transaction.commit()
}

const DB = {
  sequelize,
  models,
  initDB: async function () {
    await sequelize.sync()
    await models.Role.insertBasicRoles()
  },
  getTransaction,
  rollBackTransaction,
  commitTransaction
}

module.exports = DB
