const express = require('express')
const { authenticate, authorize } = require('../middleware/auth')
const RoleDto = require('../dtos/role')
const RoleController = require('../controllers/role')

const basicRoles = require('../util/basicRoles')

const roleRules = require('../middleware/validators/role-rules')
const validate = require('../middleware/validators/validator')
const { sendResponse, sendResponseWithError } = require('../util/httpResponse')

const router = new express.Router()

router.post(
  '/roles',
  roleRules.postRole(),
  validate,
  authenticate,
  authorize([basicRoles.superAdmin.roleName]),
  async (req, res) => {
    try {
      const postRoleDto = new RoleDto.PostRoleDto(req.body.roleName)

      const response = await RoleController.AddNewRole(postRoleDto)

      sendResponse(res, 201, response)
    } catch (error) {
      sendResponseWithError(res, 401, error)
    }
  }
)

module.exports = router
