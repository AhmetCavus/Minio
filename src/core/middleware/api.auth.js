const tokenService = require("./../services/token.service")
const responseService = require("./../services/response.service")

module.exports = (req, res, next) => {
  // Check for preflight request: https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request
  if(req.method.toLowerCase() === "options") {
    const requestHeader = req.headers["access-control-request-headers"]
    const allowMethod = req.headers["access-control-request-method"]
    if(allowMethod.toLowerCase() === "get" ||
        allowMethod.toLowerCase() === "post" ||
        allowMethod.toLowerCase() === "update" ||
        allowMethod.toLowerCase() === "delete" ||
        allowMethod.toLowerCase() === "patch") {
      return res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, UPDATE")
        .header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        .header("Access-Control-Max-Age", "86400")
        .send()
    } else {
      return res
      .status(400)
      .send()
    }
  }

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
