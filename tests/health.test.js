const request = require('supertest')
const app = require('../src/app')

test('Should check if health endpoint is working', async () => {
  await request(app)
    .get('/health')
    .send()
    .expect(200)
})
