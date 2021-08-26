const express = require('express')
const User = require('../models/user')
const jwt = require('../util/jwt')
const rules = require('../middleware/validators/user-rules')
const validate = require('../middleware/validators/validator')

const router = new express.Router()

router.post('/users', rules.PostUserRules(), validate, async (req, res) => {
  try {
    const newUser = await User.register(req.body)

    const accessToken = jwt.sign(
      {
        id: newUser.id,
        roleId: newUser.roleId,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email
      },
      process.env.ACCESS_JWT_SECRET,
      Number(process.env.ACCESS_TOKEN_LIFE_SPAN)
    )

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

module.exports = router
