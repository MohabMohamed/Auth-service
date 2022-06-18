const Role = require('../models/role')
const roleErrors = require('../errors/roleError')
const RoleDto = require('../dtos/role')
const {
  getTransaction,
  commitTransaction,
  rollBackTransaction
} = require('../db')

const AddNewRole = async postRoleDto => {
  const transaction = await getTransaction()

  try {
    const matchedRole = await Role.findOne({
      where: {
        roleName: postRoleDto.roleName
      },
      transaction
    })

    if (matchedRole) {
      throw roleErrors.existingRole()
    }

    const role = await Role.create(
      { roleName: postRoleDto.roleName },
      { transaction }
    )

    const roleResponse = new RoleDto.PostRoleResponse(role)
    await commitTransaction(transaction)
    return roleResponse
  } catch (error) {
    await rollBackTransaction(transaction)
    throw error
  }
}

module.exports = { AddNewRole }
