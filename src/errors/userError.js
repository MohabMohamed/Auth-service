const unableToLogin = () => {
  return {
    code: 401,
    errors: [{ email: 'Please recheck your email and password' }]
  }
}

module.exports = { unableToLogin }
