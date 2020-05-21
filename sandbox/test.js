const path = require("path")
var express = require("express")

const app = express()
var http = require("http").createServer(app)
var io = require("socket.io")(http)

app.use(express.static(path.join(__dirname, "public")))

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html")
})

io.on("connection", socket => {
  console.log("a user connected")
})

http.listen(3000, () => {
  console.log("listening on *:3000")
})
