const socketioJwt = require("socketio-jwt")

module.exports = (socket, next) => {
  socketioJwt.authorize({
    secret: process.env.JWT_SECRET,
    handshake: true,
  })(socket, err => {
    if(err) {
      socket.disconnect()
      next(err)
    }
    else {
      next()
    }
  })
}
