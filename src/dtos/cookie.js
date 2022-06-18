class CookieDto {
  constructor (name, payload, maxAge, httpOnly = true) {
    this.name = name
    this.payload = payload
    this.maxAge = maxAge
    this.httpOnly = httpOnly
  }
}

module.exports = CookieDto
