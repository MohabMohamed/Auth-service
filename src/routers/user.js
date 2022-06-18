const express = require('express')

const rules = require('../middleware/validators/user-rules')
const validate = require('../middleware/validators/validator')
const { authenticate } = require('../middleware/auth')
const UserController = require('../controllers/user')
const UserDto = require('../dtos/user')
const { sendResponse, sendResponseWithError } = require('../util/httpResponse')

const router = new express.Router()

router.post('/users', rules.PostUserRules(), validate, async (req, res) => {
  try {
    const userRegistrationDto = new UserDto.UserRegistrationDto(req.body)

    const response = await UserController.registerUser(userRegistrationDto)

    sendResponse(res, 201, response)
  } catch (error) {
    sendResponseWithError(res, 400, error)
  }
})

router.post('/users/login', rules.postLogin(), validate, async (req, res) => {
  try {
    const userLoginnDto = new UserDto.UserLoginDto(req.body)
    const response = await UserController.loginUser(userLoginnDto)

    sendResponse(res, 200, response)
  } catch (error) {
    sendResponseWithError(res, 400, error)
  }
})

router.get('/users/logout', authenticate, async (req, res) => {
  try {
    const userLogoutDto = new UserDto.UserLogoutDto(req.refreshToken)

    const response = await UserController.logoutUser(userLogoutDto)

    sendResponse(res, 200, response)
  } catch (error) {
    sendResponseWithError(res, 401, error)
  }
})

router.get('/users/logoutAll', authenticate, async (req, res) => {
  try {
    const userLogoutAllDto = new UserDto.UserLogoutAllDto(
      req.refreshToken,
      req.user.id
    )

    const response = await UserController.logoutAllUser(userLogoutAllDto)

    sendResponse(res, 200, response)
  } catch (e) {
    res.status(401).send()
  }
})

module.exports = router
