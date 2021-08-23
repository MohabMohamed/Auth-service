const express = require('express')
const { NODE_ENV_ENUM, runIfEnv } = require('./util/node-env')

const app = express()

runIfEnv(NODE_ENV_ENUM.prod, () => {
  const helmet = require('helmet')
  console.log('helmet')
  app.use(helmet())
})

runIfEnv(NODE_ENV_ENUM.dev, () => {
  const swaggerUi = require('swagger-ui-express')
  const swaggerSpec = require('./swagger-docs')
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

  // setting some headers for swagger as it doesn't work if CORS is blocked
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    )
    next()
  })
})

app.use(express.json())

module.exports = app
