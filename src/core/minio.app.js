require("dotenv").config()

const path = require("path")

const _ = require("lodash")
const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const compression = require("compression")
const helmet = require("helmet")
const morgan = require("morgan")

const DbAdapterFactory = require("./db/db.adapter.factory")
const DbSchemaFactory = require("./db/db.schema.factory")
const DbService = require("./db/db.service")
const adminRoutes = require("./routes/admin.route")
const authRoutes = require("./routes/auth.route")
const collectionRoutes = require("./routes/collection.route")
const authMiddleware = require("./middleware/auth")
const Profile = require("./models/profile.model")
const profileRepo = require("./repositories/profile.repository")
const cors = require("./middleware/cors")

/**
 * @description
 * This class manages the minio framework and provides
 * following services:
 * Auth sercice
 * Model service
 * API service
 * @example
 * To start the application, you have to provide an
 * .env file in the project root solution with following
 * keys:
 *
 * HOSTNAME=127.0.0.1
 * PORT=80
 * DBHOST=Address of your db engine
 * DBNAME=name of your db
 * DBUSER=admin
 * DBPASS=*****
 * DBPORT=80
 * DBAUTH=admin
 * DBENGINE=MongoDb
 * MODELDIR=The directory of your model schema
 * CREDENTIALS_COLLECTION=The collection holding the credentials
 * JWT_SECRET=The secret key of jwt
 * ROOT_CLIENT=The super user
 * ROOT_SECRET=Secret of the super user
 * ROOT_EMAIL=Mail of the super user
 * ENABLE_WEBSOCKET=true
 *
 * @tutorial
 * A minimal code snippet for starting the app:
 *
 * const Minio = require("../src/core/minio.app")
 * const minio = new Minio.App()
 * minio.start().then(() => {
 *  console.log("Minio is up and running")
 * })
 * minio.setting((app, express) => {
 *  app.get("/", (req, res) => {
 *    res.sendFile(__dirname + "/public/index.html")
 *  })
 * app.use("/todo", require("./routes/todo.route"))
 * })
 */
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
    app.use(cors)
    app.use(helmet())
    app.use(compression())
    app.use(morgan("common"))
    app.use("/authenticate", authRoutes)
    app.use("/admin", authMiddleware, adminRoutes)
    app.use("/collection", authMiddleware, collectionRoutes)
    module.exports.instance = this
  }

  /**
   * @description Resolves the collection regarding to the given name.
   * @param {string} name - The name of the collection that should be resolved.
   * @returns {Collection} the found collection matches to the given name.
   */
  collection(name) {
    return _.findLast(
      this.collections,
      o => _.toLower(o.collectionName) === _.toLower(name)
    )
  }

  /**
   * @description Launches minio by starting the necessary services..
   */
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

  /**
   * @description Invokes a callback providing the app and express instances.
   * @param {Callback} callback the callback providing parameters for specifying
   * further settings according to the routes, middleware etc..
   */
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
