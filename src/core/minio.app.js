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

class MinioApp {
  constructor() {
    this.config = require("./config/minio.config")

    this.dbService = new DbService(
      DbAdapterFactory.createAdapter(this.config.dbEngine)
    )

    this.schemaService = DbSchemaFactory.createSchemaService(
      this.config.dbEngine
    )

    app.set("view engine", "ejs")
    app.set("views", "views")

    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(morgan("common"))
    app.use("/admin", adminRoutes)
  }

  get collections() {
    return this.schemaWrappers
  }

  async start() {
    try {
      await this.connectToDb()
      this.schemaWrappers = await this.resolveCollections()
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
    const mainDir = path.dirname(require.main.filename)
    let pathToLook = _.isEmpty(modelDir)
      ? path.join(mainDir, "models")
      : path.join(mainDir, modelDir)
    const collections = await this.schemaService.resolveCollections(pathToLook)
    return this.dbService.registerCollections(collections)
  }
}

module.exports = MinioApp
