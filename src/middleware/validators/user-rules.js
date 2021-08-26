const { body } = require('express-validator')

const PostUserRules = () => {
  return [
    body(['firstName', 'lastName', 'email', 'phoneNumber'])
      .trim()
      .notEmpty()
      .toLowerCase(),

    body('email', 'Not a valid Email')
      .isEmail()
      .normalizeEmail(),

    body(
      'password',
      'Password should be 8 characters long and should contain numbers and symbols'
    ).isStrongPassword({
      minLength: 8,
      minNumbers: 1,
      minSymbols: 1,
      minLowercase: 0,
      minUppercase: 0
    }),

    body('phoneNumber').isMobilePhone()
  ]
}

const postLogin = () => {
  return [
    body('email')
      .trim()
      .notEmpty()
      .toLowerCase()
      .normalizeEmail(),

    body('password').notEmpty()
  ]
}

module.exports = { PostUserRules, postLogin }
