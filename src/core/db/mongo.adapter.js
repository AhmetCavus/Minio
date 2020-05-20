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
    const { dbUser, dbPass, dbHost, dbPort, dbName, authDb } = config
    if (_.isEmpty(dbUser) || _.isEmpty(dbPass)) {
      return f(
        "mongodb://%s:%d/%s?retryWrites=true&w=majority",
        dbHost,
        dbPort,
        dbName
      )
    } else {
      return f(
        "mongodb+srv://%s:%s@%s/%s?authSource=%s&retryWrites=true&w=majority",
        dbUser,
        dbPass,
        dbHost,
        dbName,
        authDb
      )
    }
  }
}

module.exports = MongoAdapter
