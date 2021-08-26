const existingRole = () => {
  return {
    code: 409,
    errors: ['There is a role with the same name.']
  }
}

module.exports = { existingRole }
