const CookieDto = require('./cookie')

class UserDto {
  constructor (user) {
    this.id = user.id
    this.email = user.email
    this.firstName = user.firstName
    this.lastName = user.lastName
    this.phoneNumber = user.phoneNumber
  }
}

class UserRegistrationDto {
  constructor (user) {
    const userDTO = new UserDto(user)

    return {
      ...userDTO,
      password: user.password
    }
  }
}

class UserRegistrationResponse {
  constructor (user, accessToken, refreshToken) {
    const userDTO = new UserDto(user)
    userDTO.roleId = user.roleId
    return {
      user: userDTO,
      cookies: [
        new CookieDto(
          'accessToken',
          accessToken,
          Number(process.env.ACCESS_TOKEN_LIFE_SPAN),
          true
        ),
        new CookieDto(
          'refreshToken',
          refreshToken,
          Number(process.env.REFRESH_TOKEN_LIFE_SPAN),
          true
        )
      ]
    }
  }
}

class UserLoginDto {
  constructor (user) {
    this.email = user.email
    this.password = user.password
  }
}

class UserLoginResponse {
  constructor (user, accessToken, refreshToken) {
    const userDTO = new UserDto(user)
    userDTO.roleId = user.roleId
    return {
      user: userDTO,
      accessToken,
      refreshToken,
      cookies: [
        new CookieDto(
          'accessToken',
          accessToken,
          Number(process.env.ACCESS_TOKEN_LIFE_SPAN),
          true
        ),
        new CookieDto(
          'refreshToken',
          refreshToken,
          Number(process.env.REFRESH_TOKEN_LIFE_SPAN),
          true
        )
      ]
    }
  }
}

class UserLogoutDto {
  constructor (refreshToken) {
    this.refreshToken = refreshToken
  }
}

class UserLogoutResponse {
  constructor (loggedoutSuccessfully) {
    this.ok = loggedoutSuccessfully
    this.cookies = [
      new CookieDto('accessToken', null, 0, true),
      new CookieDto('refreshToken', null, 0, true)
    ]
  }
}

class UserLogoutAllDto {
  constructor (refreshToken, userId) {
    this.refreshToken = refreshToken
    this.userId = userId
  }
}

module.exports = {
  UserDto,
  UserRegistrationResponse,
  UserRegistrationDto,
  UserLoginDto,
  UserLoginResponse,
  UserLogoutDto,
  UserLogoutResponse,
  UserLogoutAllDto
}
