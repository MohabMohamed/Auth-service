const jwt = require('jsonwebtoken')

const sign = (payload, secret, expiresIn) => {
  return jwt.sign(payload, secret, { expiresIn })
}

const verify = (token, secret) => {
  try {
    const decoded = jwt.verify(token, secret)
    return { payload: decoded, expired: false }
  } catch (e) {
    if (e.message === 'jwt expired') return { payload: null, expired: true }
  }
}

module.exports = { sign, verify }
