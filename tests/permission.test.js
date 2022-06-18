const request = require('supertest')
const { setupDatabase, cleanDB, firstRefreshToken } = require('./fixtures/db')
const app = require('../src/app')
const Permission = require('../src/models/permission')

const basicRoles = require('../src/util/basicRoles')

beforeEach(setupDatabase)
afterAll(cleanDB)

const agent = request.agent(app)

test('Should authorize new request from another service', async () => {
  agent.jar.setCookie(`refreshToken=${firstRefreshToken}`)

  await agent.post('/authorize').send({
    httpMethod: 'post',
    path: '/products'
  }).expect(200)
})

test('Should post new permission', async () => {
  agent.jar.setCookie(`refreshToken=${firstRefreshToken}`)

  await agent
    .post('/permissions')
    .send({
      httpMethod: 'post',
      path: '/users',
      roleId: basicRoles.superAdmin.id
    })
    .expect(201)

  const matchedPermission = await Permission.findOne({
    where: {
      httpMethod: 'post',
      path: '/users',
      roleId: Number(basicRoles.superAdmin.id)
    }
  })

  expect(matchedPermission).not.toBeNull()
})

test('Should delete permission', async () => {
  agent.jar.setCookie(`refreshToken=${firstRefreshToken}`)

  const permission = await Permission.findOne({
    where: {
      httpMethod: 'post',
      path: '/products'
    }
  })

  await agent
    .delete(`/permissions/${permission.id}`)
    .send()
    .expect(200)

  const matchedPermission = await Permission.findOne({
    where: {
      httpMethod: 'post',
      path: '/products'
    }
  })

  expect(matchedPermission).toBeNull()
})
