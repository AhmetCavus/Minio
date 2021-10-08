const Provider = require("./../type/provider")
const mongoose = require("mongoose")
const Schema = mongoose.Schema

class MongoTypeFactory {

    static create(type) {
        switch (type) {
          case Provider.Boolean:
            return Boolean
          case Provider.Date:
            return Date
          case Provider.Number:
            return Number
          case Provider.ObjectId:
            return Schema.Types.ObjectId
          case Provider.String:
            return String
          default:
            console.log("Unsupported type detected: " + type)
            break
        }
      }
    
}

module.exports = MongoTypeFactory