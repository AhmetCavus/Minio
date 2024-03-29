const bcrypt = require("bcryptjs")
const profileRepo = require("../repositories/profile.repository")
const tokenService = require("./../services/token.service")
const InvalidCredentialsException = require("../exceptions/invalidcredentials.exception")
const ProfileAlreadyExistsException = require("../exceptions/profilealreadyexists.exception")

class AuthService {
  constructor() {}

  async authenticate(email, password) {
    const profile = await profileRepo.find(email)
    const secret = profile ? profile.password : ''
    const isMatch = await bcrypt.compare(password, secret)
    if (isMatch) {
      return tokenService.sign({
        id: profile._id.toString(),
        username: profile.username,
        email: profile.email,
      })
    } else {
      throw new InvalidCredentialsException()
    }
  }

  async register(username, email, password) {
    const profile = await profileRepo.find(email)
    if (!profile) {
      const profile = await profileRepo.create({
        username: username,
        email: email,
        password: password,
      })
      return tokenService.sign({
        id: profile._id.toString(),
        username: profile.username,
        email: profile.email,
      })
    } else {
      throw new ProfileAlreadyExistsException()
    }
  }
}

module.exports = new AuthService()
