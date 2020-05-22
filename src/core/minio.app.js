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
const authRoutes = require("./routes/auth.route")
const collectionRoutes = require("./routes/collection.route")
const authMiddleware = require("./middleware/auth")
const Profile = require("./models/profile.model")
const profileRepo = require("./repositories/profile.repository")

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
    app.use(bodyParser.json({ extended: false }))
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(morgan("common"))
    app.use("/authenticate", authRoutes)
    app.use("/admin", authMiddleware, adminRoutes)
    app.use("/collection", authMiddleware, collectionRoutes)
    module.exports.instance = this
  }

  collection(name) {
    return _.findLast(
      this.collections,
      o => _.toLower(o.collectionName) === _.toLower(name)
    )
  }

  async start() {
    try {
      await this.connectToDb()
      await this.resolveCollections()
      await this.ensureCredentialsCollectionCreated()
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

      if (process.env.ENABLE_WEBSOCKET) {
        const server = require("http").Server(app)
        server.listen(port, () => {
          console.log("Minio app listening on port " + port)
          resolve()
        })
        require("./services/pubsub.service")(server)
        Object.keys(this.collections).forEach(name => {
          this.collections[name].enableSocket()
        })
      } else {
        app.listen(port, hostname, () => {
          console.log("Minio app listening on port " + port)
          resolve()
        })
      }
    }).catch(error => reject(error))
  }

  connectToDb = async () => {
    await this.dbService.connect(this.config)
  }

  resolveCollections = async () => {
    const { modelDir } = this.config
    let pathToLook = _.isEmpty(modelDir)
      ? path.join(this.mainDir, "models")
      : path.join(this.mainDir, modelDir)
    this.collections = await this.schemaService.resolveCollections(pathToLook)
    return this.dbService.registerCollections(this.collections)
  }

  ensureCredentialsCollectionCreated = async () => {
    if (!this.collection("Profile")) this.collections.push(Profile)
    this.schemaService.createSchemas([Profile])
    this.dbService.registerCollections([Profile])
    if (await profileRepo.isInitialized()) return
    const result = await profileRepo.create({
      name: process.env.ROOT_CLIENT,
      email: process.env.ROOT_EMAIL,
      password: process.env.ROOT_SECRET,
      role: "Admin",
    })
    if (result.errors) throw new Error(result.errors)
  }
}

module.exports.App = MinioApp
