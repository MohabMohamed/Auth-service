const swaggerJSDoc = require('swagger-jsdoc')

const swaggerDefinition = {
  info: {
    title: 'Auth service',
    version: '1.0.0',
    description: 'User authentication and authorization service'
  },
  host: 'localhost:3000'
}

const options = {
  swaggerDefinition,
  apis: ['./src/docs/**/*.yaml']
}

const swaggerSpec = swaggerJSDoc(options)

module.exports = swaggerSpec
