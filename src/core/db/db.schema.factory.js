const MongoSchemaService = require("./mongo.schema.service")
const SupportedEngine = require("./supported.engine")
const NotSupportedDbException = require("./notsupported.dbexception")

class DbSchemaFactory {
  static createSchemaService(dbEngine) {
    switch (dbEngine) {
      case SupportedEngine.MongoDb:
        return new MongoSchemaService()
      default:
        throw new NotSupportedDbException("This db engine is not supported")
    }
  }
}

module.exports = DbSchemaFactory
