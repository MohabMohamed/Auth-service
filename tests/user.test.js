const request = require('supertest')
const { CookieAccessInfo } = require('cookiejar')
const { setupDatabase, cleanDB } = require('./fixtures/db')
const app = require('../src/app')
const User = require('../src/models/user')
const RefreshToken = require('../src/models/refresh-token')

beforeEach(setupDatabase)
afterAll(cleanDB)

const agent = request.agent(app)

test('Should register new user', async () => {
  const response = await agent.post('/users').send({
    firstName: 'john',
    lastName: 'Doe',
    email: 'Awesome@gmail.com',
    password: '1234bbvw!#',
    phoneNumber: '0100821751'
  }).expect(201)

  const createdUserId = parseInt(response.body.user.id)

  const user = User.findByPk(createdUserId)
  expect(user).not.toBeNull()

  const accessInfo = CookieAccessInfo()
  const ResponseRefreshToken = agent.jar.getCookie('refreshToken', accessInfo).value

  const refreshToken = await RefreshToken.findOne({
    where: {
      userId: createdUserId,
      token: ResponseRefreshToken
    }
  })

  expect(refreshToken).not.toBeNull()
  expect(refreshToken.getDataValue('token')).toBe(ResponseRefreshToken)
})

test("Shouldn't register new user with existing email", async () => {
  await agent.post('/users').send({
    firstName: 'jane',
    lastName: 'Doe',
    email: 'test@gmail.com',
    password: '8882cebbvw!#',
    phoneNumber: '01138373750'
  }).expect(409)
})
