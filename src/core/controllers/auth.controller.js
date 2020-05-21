const authService = require("./../services/auth.service")
const responseService = require("./../services/response.service")
const InvalidCredentialsException = require("../exceptions/invalidcredentials.exception")
const ProfileAlreadyExistsException = require("../exceptions/profilealreadyexists.exception")

exports.authenticate = async (req, res) => {
  try {
    const token = await authService.authenticate(
      req.body.email,
      req.body.password
    )
    res.json(responseService.createSuccess("token", token))
  } catch (error) {
    if (error instanceof InvalidCredentialsException) {
      res.status(403).json(responseService.createFail("Invalid credentials."))
    } else {
      res.status(400).json(responseService.createFail(error))
    }
  }
}

exports.register = async (req, res) => {
  try {
    const profile = await authService.register(
      req.body.username,
      req.body.email,
      req.body.password
    )
    res.json(responseService.createSuccess("profile", profile))
  } catch (error) {
    if (error instanceof ProfileAlreadyExistsException) {
      res
        .status(400)
        .json(responseService.createFail("The profile already exists."))
    } else {
      res.status(400).json(responseService.createFail(error))
    }
  }
}
