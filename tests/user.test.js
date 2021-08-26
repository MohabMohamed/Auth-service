const request = require('supertest')
const { CookieAccessInfo } = require('cookiejar')
const { setupDatabase, cleanDB, firstRefreshToken } = require('./fixtures/db')
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
  expect(refreshToken.token).toBe(ResponseRefreshToken)
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

test('Should login the user', async () => {
  const response = await agent.post('/users/login').send({
    email: 'test@gmail.com',
    password: '1234b0i@(bvw'
  }).expect(200)

  const accessInfo = CookieAccessInfo()
  const ResponseRefreshToken = agent.jar.getCookie('refreshToken', accessInfo).value

  const refreshToken = await RefreshToken.findOne({
    where: {
      userId: response.body.user.id,
      token: ResponseRefreshToken
    }
  })
  console.log(refreshToken)
  expect(refreshToken).not.toBeNull()
  expect(refreshToken.token).toBe(ResponseRefreshToken)
})

test("Shouldn't login the user for wrong credentials", async () => {
  const response = await agent.post('/users/login').send({
    email: 'test@gmail.com',
    password: 'not the right password'
  }).expect(401)
})

test('should logout the user', async () => {
  agent.jar.setCookie(`refreshToken=${firstRefreshToken}`)
  await agent.get('/users/logout').send().expect(200)

  const matchedRefreshToken = await RefreshToken.findOne({ where: { token: firstRefreshToken } })

  expect(matchedRefreshToken).toBeNull()
})
