const request = require('supertest')
const { setupDatabase, cleanDB, firstRefreshToken } = require('./fixtures/db')
const app = require('../src/app')
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
