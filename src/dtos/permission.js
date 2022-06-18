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

module.exports = { PostAuthorizationDto, PostAuthorizationResponse }
