const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
  //get the token from the header if present
  const authHeader = req.headers.authorization
  //if no token found, return response (without going to the next middelware)
  if (!authHeader)
    return res.status(401).send("Access denied. No token provided.")

  try {
    const token = authHeader.replace("Bearer", "").trim()

    //if can verify the token, set req.user and pass to next middleware
    const decoded = jwt.verify(token, process.env.SECRETKEY, {
      algorithms: ["HS384"],
    })
    req.user = decoded
    next()
  } catch (ex) {
    //if invalid token
    res.status(400).send("Invalid token.")
  }
}
