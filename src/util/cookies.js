const sendCookiesIfExist = (res, responePayload) => {
  if (responePayload.cookies) {
    responePayload.cookies.forEach(cookie => {
      res.cookie(cookie.name, cookie.payload, {
        maxAge: cookie.maxAge,
        httpOnly: cookie.httpOnly
      })
    })
    delete responePayload.cookies
  }
  return res
}

module.exports = { sendCookiesIfExist }
