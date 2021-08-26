const { body } = require('express-validator')

const authenticateRole = () => {
  return [
    body(['httpMethod', 'path'])
      .trim()
      .notEmpty()
      .toLowerCase()
  ]
}

module.exports = { authenticateRole }
