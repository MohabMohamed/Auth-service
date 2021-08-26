const express = require('express')
const { authenticate, authorize } = require('../middleware/auth')
const Role = require('../models/role')
const basicRoles = require('../util/basicRoles')
const roleErrors = require('../errors/roleError')
const roleRules = require('../middleware/validators/role-rules')
const validate = require('../middleware/validators/validator')

const router = new express.Router()

router.post(
  '/roles',
  roleRules.postRole(),
  validate,
  authenticate,
  authorize([basicRoles.superAdmin.roleName]),
  async (req, res) => {
    try {
      const matchedRole = await Role.findOne({
        where: {
          roleName: req.body.roleName
        }
      })
      if (matchedRole) {
        throw roleErrors.existingRole()
      }

      const role = await Role.create({ roleName: req.body.roleName })

      res.status(201).send(role)
    } catch (error) {
      const statusCode = error.code || 401
      res.status(statusCode).send(error)
    }
  }
)

module.exports = router
