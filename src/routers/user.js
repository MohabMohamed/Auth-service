const express = require('express')
const User = require('../models/user')
const RefreshToken = require('../models/refresh-token')
const rules = require('../middleware/validators/user-rules')
const validate = require('../middleware/validators/validator')

const router = new express.Router()

router.post('/users', rules.PostUserRules(), validate, async (req, res) => {
  try {
    const newUser = await User.register(req.body)

    const accessToken = newUser.generateAccessToken()
    const refreshToken = newUser.refreshToken[0].token

    res.cookie('accessToken', accessToken, {
      maxAge: Number(process.env.ACCESS_TOKEN_LIFE_SPAN),
      httpOnly: true
    })

    res.cookie('refreshToken', refreshToken, {
      maxAge: Number(process.env.REFRESH_TOKEN_LIFE_SPAN),
      httpOnly: true
    })

    res.status(201).send({ user: newUser, accessToken, refreshToken })
  } catch (error) {
    const statusCode = error.code || 400
    res.status(statusCode).send(error)
  }
})

router.post('/users/login', rules.postLogin(), validate, async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)

    const accessToken = user.generateAccessToken()
    const refreshToken = User.generateRefreshToken()

    await RefreshToken.create({ token: refreshToken, userId: user.id })

    res.cookie('accessToken', accessToken, {
      maxAge: Number(process.env.ACCESS_TOKEN_LIFE_SPAN),
      httpOnly: true
    })

    res.cookie('refreshToken', refreshToken, {
      maxAge: Number(process.env.REFRESH_TOKEN_LIFE_SPAN),
      httpOnly: true
    })

    res.status(200).send({ user, accessToken, refreshToken })
  } catch (error) {
    const statusCode = error.code || 400
    res.status(statusCode).send(error)
  }
})

module.exports = router
