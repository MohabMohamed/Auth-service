class PostRoleDto {
  constructor (roleName) {
    this.roleName = roleName
  }
}

class PostRoleResponse {
  constructor (role) {
    this.roleName = role.roleName
    this.id = role.id
  }
}

module.exports = { PostRoleDto, PostRoleResponse }
