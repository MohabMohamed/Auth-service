const User = require('../models/user')
const RefreshToken = require('../models/refresh-token')
const UserDto = require('../dtos/user')
const {
  getTransaction,
  commitTransaction,
  rollBackTransaction
} = require('../db')

const registerUser = async userRegistrationDto => {
  const transaction = await getTransaction()

  try {
    const newUser = await User.register(userRegistrationDto, transaction)

    const accessToken = newUser.generateAccessToken()
    const refreshToken = newUser.refreshToken[0].token

    const userRegistrationResponse = new UserDto.UserRegistrationResponse(
      newUser,
      accessToken,
      refreshToken
    )
    await commitTransaction(transaction)
    return userRegistrationResponse
  } catch (error) {
    await rollBackTransaction(transaction)
    throw error
  }
}

const loginUser = async userLoginDto => {
  const transaction = await getTransaction()
  try {
    const user = await User.findByCredentials(
      userLoginDto.email,
      userLoginDto.password,
      transaction
    )

    const accessToken = user.generateAccessToken()
    const refreshToken = User.generateRefreshToken()

    await RefreshToken.create(
      { token: refreshToken, userId: user.id },
      { transaction }
    )

    const userLoginResponse = new UserDto.UserLoginResponse(
      user,
      accessToken,
      refreshToken
    )

    await commitTransaction(transaction)
    return userLoginResponse
  } catch (error) {
    await rollBackTransaction(transaction)
    throw error
  }
}

const logoutUser = async userLogoutDto => {
  const transaction = await getTransaction()
  try {
    if (!userLogoutDto.refreshToken) {
      throw new Error()
    }

    await RefreshToken.destroy({
      where: {
        token: userLogoutDto.refreshToken
      },
      transaction
    })

    const userLogoutResponse = new UserDto.UserLogoutResponse(true)

    await commitTransaction(transaction)
    return userLogoutResponse
  } catch (error) {
    await rollBackTransaction(transaction)
    throw error
  }
}

const logoutAllUser = async userLogoutAllDto => {
  const transaction = await getTransaction()
  try {
    if (!userLogoutAllDto.refreshToken) {
      throw new Error()
    }

    await RefreshToken.destroy({
      where: {
        userId: userLogoutAllDto.userId
      },
      transaction
    })

    const userLogoutAllResponse = new UserDto.UserLogoutResponse(true)

    await commitTransaction(transaction)
    return userLogoutAllResponse
  } catch (error) {
    await rollBackTransaction(transaction)
    throw error
  }
}

module.exports = { registerUser, loginUser, logoutUser, logoutAllUser }
