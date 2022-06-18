const { body } = require('express-validator')

const authenticateRole = () => {
  return [
    body(['httpMethod', 'path'])
      .trim()
      .notEmpty()
      .toLowerCase()
  ]
}

const postPermission = () => {
  return [
    body(['httpMethod', 'path'])
      .trim()
      .notEmpty()
      .toLowerCase(),
    body('roleId').isNumeric()
  ]
}

module.exports = { authenticateRole, postPermission }
