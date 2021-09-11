const bcrypt = require("bcrypt")
const profileRepo = require("../repositories/profile.repository")
const tokenService = require("./../services/token.service")
const InvalidCredentialsException = require("../exceptions/invalidcredentials.exception")
const ProfileAlreadyExistsException = require("../exceptions/profilealreadyexists.exception")

class AuthService {
  constructor() {}

  async authenticate(email, password) {
    const profile = await profileRepo.find(email)
    const isMatch = await bcrypt.compare(password, profile?.password || '')
    if (isMatch) {
      return tokenService.sign({
        id: profile._id.toString(),
        name: profile.name,
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
        name: profile.name,
        email: profile.email,
      })
    } else {
      throw new ProfileAlreadyExistsException()
    }
  }
}

module.exports = new AuthService()
