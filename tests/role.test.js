const request = require('supertest')
const { setupDatabase, cleanDB, firstRefreshToken, secondRefreshToken, firstUser, secondUser } = require('./fixtures/db')
const app = require('../src/app')
const Role = require('../src/models/role')
const { CookieAccessInfo } = require('cookiejar')
const { cookie } = require('express-validator')

beforeEach(setupDatabase)
afterAll(cleanDB)

const agent = request.agent(app)

test('Should Add new role', async () => {
  agent.jar.setCookie(`refreshToken=${firstRefreshToken}`)

  await agent.post('/roles').send({
    roleName: 'supervisor'
  }).expect(201)
  const role = await Role.findOne({ where: { roleName: 'supervisor' } })

  expect(role).not.toBeNull()
})
