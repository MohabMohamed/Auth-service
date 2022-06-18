const express = require('express')
const permissionRules = require('../middleware/validators/permission-rules')
const validate = require('../middleware/validators/validator')
const { authenticate } = require('../middleware/auth')
const permissionDto = require('../dtos/permission')
const PermissionControlller = require('../controllers/permission')
const { sendResponse, sendResponseWithError } = require('../util/httpResponse')

const router = new express.Router()

router.post(
  '/authorize',
  permissionRules.authenticateRole(),
  validate,
  authenticate,
  async (req, res) => {
    try {
      const postAuthorizationDto = new permissionDto.PostAuthorizationDto(
        req.body.httpMethod,
        req.body.path,
        req.user.roleId
      )
      const response = await PermissionControlller.authorize(
        postAuthorizationDto
      )

      sendResponse(res, 200, response)
    } catch (error) {
      sendResponseWithError(res, 401, error)
    }
  }
)

module.exports = router
