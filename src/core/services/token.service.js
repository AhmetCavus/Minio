const jwt = require("jsonwebtoken")

class TokenService {
  constructor() {
    console.log("TokenService created")
  }

  verify(token) {
    return jwt.verify(token, process.env.JWT_SECRET, [
      process.env.HASH_ALGORITHM || "HS384",
    ])
  }

  sign(profile) {
    return jwt.sign(profile, process.env.JWT_SECRET, {
      algorithm: process.env.HASH_ALGORITHM || "HS384",
      expiresIn: "24h",
    })
  }
}

module.exports = new TokenService()
