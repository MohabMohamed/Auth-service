const notPermitted = () => {
  return {
    code: 401,
    errors: ['The user is unauthorized to access this endpoint.']
  }
}

module.exports = { notPermitted }
