const wrongToken = () => {
  return {
    code: 401,
    errors: [{ session: 'Your session is expired please login again.' }]
  }
}

module.exports = { wrongToken }
