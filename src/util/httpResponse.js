const { sendCookiesIfExist } = require('./cookies')
const sendResponse = (res, statusCode, payload) => {
  res = sendCookiesIfExist(res, payload)

  res.status(statusCode).send(payload)
}

const sendResponseWithError = (res, DefualtStatusCode, error) => {
  const statusCode = error.code || DefualtStatusCode
  res.status(statusCode).send(error)
}

module.exports = { sendResponse, sendResponseWithError }
