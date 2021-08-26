const jwt = require('../util/jwt')
const RefreshToken = require('../models/refresh-token')
const refreshTokenError = require('../errors/refreshTokenError')

const auth = async (req, res, next) => {
  try {
    const { accessToken, refreshToken } = req.cookies

    // if accessToken cookie didn't expire yet
    if (accessToken) {
      const { payload, expired } = jwt.verify(
        accessToken,
        process.env.ACCESS_JWT_SECRET
      )

      if (expired || !refreshToken) {
        throw refreshTokenError.wrongToken()
      }

      if (payload) {
        req.accessToken = accessToken
        req.user = payload
        return next()
      }
    }

    // if unexpired refresh token presented, generate new access token and continue

    const decodedRefreshToken = jwt.verify(
      refreshToken,
      process.env.REFRESH_JWT_SECRET
    )
    if (decodedRefreshToken.expired || !decodedRefreshToken.payload) {
      throw refreshTokenError.wrongToken()
    }

    const { user, matchedRefreshToken } = await RefreshToken.getUserByToken(
      refreshToken
    )

    if (!matchedRefreshToken) {
      throw refreshTokenError.wrongToken()
    }

    const newAccessToken = user.generateAccessToken()

    req.accessToken = newAccessToken
    req.user = user
    res.cookie('accessToken', newAccessToken, {
      maxAge: Number(process.env.ACCESS_TOKEN_LIFE_SPAN),
      httpOnly: true
    })
    return next()
  } catch (error) {
    res.status(error.code).send(error)
  }
}

module.exports = auth
