const MinioApp = require("../src/core/minio.app")

const minio = new MinioApp()

minio.start().then(() => {
  console.log("Minio is up and running")
})

minio.setting((app, express) => {
  app.use("/todo", require("./routes/todo.route"))
})
