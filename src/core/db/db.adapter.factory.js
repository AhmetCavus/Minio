const MongoAdapter = require("./mongo.adapter")
const SupportedEngine = require("./supported.engine")
const NotSupportedDbException = require("./notsupported.dbexception")

class DbAdapterFactory {
  static createAdapter(dbEngine) {
    switch (dbEngine) {
      case SupportedEngine.MongoDb:
        return new MongoAdapter()
      default:
        throw new NotSupportedDbException("This db engine is not supported")
    }
  }
}

module.exports = DbAdapterFactory
