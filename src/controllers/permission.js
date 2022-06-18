const Permission = require('../models/permission')
const PermissionDto = require('../dtos/permission')
const { notPermitted } = require('../errors/permissionError')
const {
  getTransaction,
  commitTransaction,
  rollBackTransaction
} = require('../db')

const authorize = async postAuthorizationDto => {
  const transaction = await getTransaction()

  try {
    const permission = await Permission.findOne({
      where: {
        httpMethod: postAuthorizationDto.httpMethod,
        path: postAuthorizationDto.path,
        roleId: postAuthorizationDto.roleId
      },
      transaction
    })
    if (!permission) {
      throw notPermitted()
    }

    const autheResponse = new PermissionDto.PostAuthorizationResponse(
      permission
    )
    await commitTransaction(transaction)
    return autheResponse
  } catch (error) {
    await rollBackTransaction(transaction)
    throw error
  }
}

module.exports = { authorize }
