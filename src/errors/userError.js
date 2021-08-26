const unableToLogin = () => {
  return {
    code: 401,
    errors: [{ password: 'Please recheck your email and password' }]
  }
}

const unableToRegister = () => {
  return {
    code: 400,
    errors: ['Unable to register']
  }
}

const existingEmail = () => {
  return {
    code: 409,
    errors: [{ email: 'There is an account with the same email' }]
  }
}

module.exports = { unableToLogin, existingEmail, unableToRegister }
