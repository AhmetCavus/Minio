const bcrypt = require("bcrypt")

const credentialsRepo = require("../repositories/credential.repository")

exports.authenticate = async (req, res, next) => {
  try {
    const credential = await credentialsRepo.find(req.body.email)
    const isMatch = await bcrypt.compare(req.body.password, credential.password)
    if (isMatch) {
      res.json(credential)
    } else {
      res.status(401).json({ error: "Invalid credentials" })
    }
  } catch (error) {
    res.status(401).json(error)
  }
}

exports.register = (req, res) => {
  credentialsRepo
    .findAdmin(req.body)
    .then(result => onCreateSuccess(result, res))
    .catch(err => onCreateFail(err, res))
}

function onAuthSuccess(profile, res) {
  res.status(200).json(createSuccessResponse(profile))
}

function onAuthFail(error, res) {
  res.status(400).json(createFailResponse(error))
}

function onCreateSuccess(profile, res) {
  res.status(200).json(createSuccessResponse(profile))
}

function onCreateFail(error) {
  res.status(400).json(createFailResponse(error))
}

function createSuccessResponse(profile) {
  var token = tokenService.signToken(JSON.stringify(profile))
  var result = undefined
  if (token) result = responseService.createSuccess("token", token)
  else result = responseService.createFail("error", "Token creation failed")
  return result
}

function createFailResponse(error) {
  return responseService.createFail("error", error)
}
