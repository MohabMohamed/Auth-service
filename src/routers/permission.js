const express = require('express')
const permissionRules = require('../middleware/validators/permission-rules')
const validate = require('../middleware/validators/validator')
const { authenticate } = require('../middleware/auth')
const Permission = require('../models/permission')
const Role = require('../models/role')
const { notPermitted } = require('../errors/permissionError')

const router = new express.Router()

router.post(
  '/authorize',
  permissionRules.authenticateRole(),
  validate,
  authenticate,
  async (req, res) => {
    try {
      const permission = Permission.findOne({
        where: {
          httpMethod: req.body.httpMethod,
          path: req.body.path,
          roleId: req.user.roleId
        }
      })
      if (!permission) {
        throw notPermitted()
      }
      res.status(200).send({ authorized: true })
    } catch (error) {
      const statusCode = error.code || 401
      res.status(statusCode).send(error)
    }
  }
)

module.exports = router
