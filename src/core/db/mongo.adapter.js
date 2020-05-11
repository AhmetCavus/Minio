const f = require("util").format
const _ = require("lodash")
const mongoose = require("mongoose")

class MongoAdapter {
  modelMap = {}

  constructor() {}

  connect(config) {
    this.connectionString = this.createConnectionString(config)
    return new Promise((resolve, reject) => {
      mongoose.connect(this.connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      mongoose.connection.on("error", error => {
        reject(error)
      })
      mongoose.connection.on("open", () => {
        resolve()
      })
    })
  }

  registerCollections(collections) {
    collections.forEach(collection => {
      collection.model = mongoose.model(collection.name, collection.schema)
      this.modelMap[collection.name] = collection.model
    })
    return this.modelMap
  }

  createConnectionString = config => {
    const { dbUser, dbPass, hostname, dbPort, dbName, authDb } = config
    if (_.isEmpty(dbUser) || _.isEmpty(dbPass)) {
      return f("mongodb://%s:%d/%s", hostname, dbPort, dbName)
    } else {
      return f(
        "mongodb://%s:%s@%s:%d/%s?authSource=%s",
        dbUser,
        dbPass,
        hostname,
        dbPort,
        dbName,
        authDb
      )
    }
  }
}

module.exports = MongoAdapter
