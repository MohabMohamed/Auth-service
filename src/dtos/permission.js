class PostAuthorizationDto {
  constructor (httpMethod, path, roleId) {
    this.httpMethod = httpMethod
    this.path = path
    this.roleId = roleId
  }
}

class PostAuthorizationResponse {
  constructor (isAuthorized) {
    this.authorized = isAuthorized
  }
}

class PostPermissionDto {
  constructor (httpMethod, path, roleId) {
    this.httpMethod = httpMethod
    this.path = path
    this.roleId = roleId
  }
}

class PostPermissionResponse {
  constructor (permission) {
    this.id = permission.id
    this.httpMethod = permission.httpMethod
    this.path = permission.path
    this.roleId = permission.roleId
  }
}

module.exports = {
  PostAuthorizationDto,
  PostAuthorizationResponse,
  PostPermissionDto,
  PostPermissionResponse
}
