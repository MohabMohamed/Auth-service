const express = require('express')
const cookieParser = require('cookie-parser')
const { NODE_ENV_ENUM, runIfEnv, runIfNotEnv } = require('./util/node-env')
const healthRouter = require('./routers/health')
const userRouter = require('./routers/user')
const db = require('./db/index')

const app = express()

runIfNotEnv(NODE_ENV_ENUM.test, async () => {
  await db.initDB()
})

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
app.use(cookieParser())
app.use(healthRouter)
app.use(userRouter)

module.exports = app
