const mongoose = require("mongoose")
const Schema = mongoose.Schema
const fs = require("fs-extra")
const path = require("path")
const _ = require("lodash")

const Provider = require("./../type/provider")

class MongoSchemaService {
  constructor() {}

  async resolveCollections(sourceOfCollections) {
    const collectionFiles = await this.resolveCollectionFiles(
      sourceOfCollections
    )
    const collections = this.requireCollections(
      sourceOfCollections,
      collectionFiles
    )
    await this.createSchemas(collections)
    return collections
  }

  async resolveCollectionFiles(sourceOfCollections) {
    const allFiles = await fs.readdir(sourceOfCollections)
    return allFiles.filter(file => file.endsWith(".js"))
  }

  requireCollections(sourceOfCollections, collectionFiles) {
    const collections = []
    collectionFiles.forEach(fileName => {
      collections.push(require(path.join(sourceOfCollections, fileName)))
    })
    return collections
  }

  createSchemas(collections) {
    return new Promise((resolve, reject) => {
      const schemas = []
      collections.forEach(collection => {
        collection.convertToSchema(preDefinition => {
          const schema = new Schema(this.createMongooseSchema(preDefinition))
          schemas.push(schema)
          return schema
        })
      })
      resolve(schemas)
    })
  }

  createMongooseSchema(schemaDefinition) {
    const newSchema = { ...schemaDefinition }
    const schemaKeys = Object.keys(newSchema)
    schemaKeys.forEach(schemaKey => {
      const value = newSchema[schemaKey]
      if (Array.isArray(value)) {
        const arraySchema = this.createMongooseSchema(value[0])
        newSchema[schemaKey] = [arraySchema]
      } else if (typeof value === "object") {
        newSchema[schemaKey] = this.createMongooseSchema(value)
      } else {
        if (schemaKey !== "type") return
        newSchema[schemaKey] = this.createMongooseType(value)
      }
    })
    return newSchema
  }

  createMongooseType(type) {
    switch (type) {
      case Provider.Boolean:
        return Boolean
      case Provider.Date:
        return Schema.Types.Date
      case Provider.Number:
        return Number
      case Provider.ObjectId:
        return Schema.Types.ObjectId
      case Provider.String:
        return String
      default:
        console.log("Unsuppoerted type detected: " + type)
        break
    }
  }
}

module.exports = MongoSchemaService
