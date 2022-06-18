const Permission = require('../models/permission')
const PermissionDto = require('../dtos/permission')
const {
  notPermitted,
  noMatchingRoleId,
  noMatchingPermissionId
} = require('../errors/permissionError')

const Role = require('../models/role')

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

const postPermission = async postPermissionDto => {
  const transaction = await getTransaction()

  try {
    const matchedRole = await Role.findByPk(Number(postPermissionDto.roleId), {
      transaction
    })

    if (!matchedRole) {
      throw noMatchingRoleId()
    }
    const permission = await Permission.create(
      {
        httpMethod: postPermissionDto.httpMethod,
        path: postPermissionDto.path,
        roleId: matchedRole.id
      },
      { transaction }
    )

    const postPermissionResponse = new PermissionDto.PostPermissionResponse(
      permission
    )
    await commitTransaction(transaction)
    return postPermissionResponse
  } catch (error) {
    await rollBackTransaction(transaction)
    throw error
  }
}

const deletePermission = async permissionId => {
  const transaction = await getTransaction()

  try {
    const matchedPermission = await Permission.findByPk(Number(permissionId), {
      transaction
    })

    if (!matchedPermission) {
      throw noMatchingPermissionId()
    }
    const deletedPermission = await matchedPermission.destroy({ transaction })

    const deletedPermissionResponse = new PermissionDto.PostPermissionResponse(
      deletedPermission
    )
    await commitTransaction(transaction)
    return deletedPermissionResponse
  } catch (error) {
    await rollBackTransaction(transaction)
    throw error
  }
}

module.exports = { authorize, postPermission, deletePermission }
