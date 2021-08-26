const { body } = require('express-validator')

const postRole = () => {
  return [
    body('roleName')
      .trim()
      .notEmpty()
      .toLowerCase()
  ]
}

module.exports = { postRole }
