const Minio = require("../src/core/minio.app")

const minio = new Minio.App()

try {
  minio.start({ enableWebsocket: true }).then(() => {
    console.log("Minio is up and running")
  })
} catch (error) {
  console.log(error)
}

minio.setting((app, express) => {
  app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html")
  })
  app.use("/todo", require("./routes/todo.route"))
})
