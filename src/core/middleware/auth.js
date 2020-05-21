const tokenService = require("./../services/token.service")
const responseService = require("./../services/response.service")

module.exports = (req, res, next) => {
  //get the token from the header if present
  const authHeader = req.headers.authorization
  //if no token found, return response (without going to the next middelware)
  if (!authHeader)
    return res
      .status(401)
      .json(responseService.createFail("Access denied. No token provided"))

  try {
    const token = authHeader.replace("Bearer", "").trim()
    const decoded = tokenService.verify(token)
    req.user = decoded
    next()
  } catch (ex) {
    res.status(400).json(responseService.createFail("Invalid token."))
  }
}
