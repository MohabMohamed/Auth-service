const express = require('express')
const User = require('../models/user')
const RefreshToken = require('../models/refresh-token')
const rules = require('../middleware/validators/user-rules')
const validate = require('../middleware/validators/validator')
const { authenticate } = require('../middleware/auth')

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

router.get('/users/logout', authenticate, async (req, res) => {
  try {
    if (!req.refreshToken) {
      throw new Error()
    }
    await RefreshToken.destroy({
      where: {
        token: req.refreshToken
      }
    })

    res.cookie('accessToken', null, {
      maxAge: 0,
      httpOnly: true
    })

    res.cookie('refreshToken', null, {
      maxAge: 0,
      httpOnly: true
    })
    res.send({ ok: true })
  } catch (e) {
    res.status(401).send()
  }
})

router.get('/users/logoutAll', authenticate, async (req, res) => {
  try {
    if (!req.refreshToken) {
      throw new Error()
    }
    await RefreshToken.destroy({
      where: {
        userId: req.user.id
      }
    })

    res.cookie('accessToken', null, {
      maxAge: 0,
      httpOnly: true
    })

    res.cookie('refreshToken', null, {
      maxAge: 0,
      httpOnly: true
    })

    res.send({ ok: true })
  } catch (e) {
    res.status(401).send()
  }
})

module.exports = router
