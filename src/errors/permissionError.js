const notPermitted = () => {
  return {
    code: 401,
    errors: ['The user is unauthorized to access this endpoint.']
  }
}

const noMatchingRoleId = () => {
  return {
    code: 404,
    errors: ["There's no role with the given role id."]
  }
}

const noMatchingPermissionId = () => {
  return {
    code: 404,
    errors: ["There's no permission with the given id."]
  }
}

module.exports = { notPermitted, noMatchingRoleId, noMatchingPermissionId }
