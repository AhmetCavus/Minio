const path = require("path")

const _ = require("lodash")
const bodyParser = require("body-parser")
const express = require("express")
const app = express()
const morgan = require("morgan")
require("dotenv").config()

const DbAdapterFactory = require("./db/db.adapter.factory")
const DbSchemaFactory = require("./db/db.schema.factory")
const DbService = require("./db/db.service")
const adminRoutes = require("./routes/admin.route")
const auth = require("./middleware/auth")

class MinioApp {
  constructor() {
    this.mainDir = path.dirname(require.main.filename)
    this.config = require("./config/minio.config")
    this.dbService = new DbService(
      DbAdapterFactory.createAdapter(this.config.dbEngine)
    )
    this.schemaService = DbSchemaFactory.createSchemaService(
      this.config.dbEngine
    )

    app.set("view engine", "ejs")
    app.set("views", "views")
    app.use(express.static(path.join(this.mainDir, "public")))
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(morgan("common"))
    app.use("/admin", auth, adminRoutes)
  }

  collection(name) {
    return this.collections[name]
  }

  async start() {
    try {
      await this.connectToDb()
      this.collections = await this.resolveCollections()
      await this.startServer()
    } catch (error) {
      console.log(error)
    }
  }

  setting(callback) {
    callback(app, express)
  }

  startServer = () => {
    return new Promise((resolve, reject) => {
      const { hostname, port } = this.config
      app.listen(port, hostname, () => {
        console.log("Minio app listening on port " + port)
        resolve()
      })
    })
  }

  connectToDb = async () => {
    await this.dbService.connect(this.config)
  }

  resolveCollections = async () => {
    const { modelDir } = this.config
    let pathToLook = _.isEmpty(modelDir)
      ? path.join(this.mainDir, "models")
      : path.join(this.mainDir, modelDir)
    const collections = await this.schemaService.resolveCollections(pathToLook)
    return this.dbService.registerCollections(collections)
  }
}

module.exports = MinioApp
