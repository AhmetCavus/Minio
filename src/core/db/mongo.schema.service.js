const mongoose = require("mongoose")
const Schema = mongoose.Schema
const fs = require("fs-extra")
const path = require("path")
const _ = require("lodash")

const MongoTypeFactory = require("./mongo.type.factory")

const resolveCollectionFiles = Symbol("resolveCollectionFiles")
const requireCollections = Symbol("requireCollections")
const createMongooseSchema = Symbol("createMongooseSchema")

class MongoSchemaService {
  constructor() {}

  async resolveCollections(sourceOfCollections) {
    const collectionFiles = await this[resolveCollectionFiles](
      sourceOfCollections
    )
    const collections = this[requireCollections](
      sourceOfCollections,
      collectionFiles
    )
    await this.createSchemas(collections)
    return collections
  }

  async [resolveCollectionFiles](sourceOfCollections) {
    const allFiles = await fs.readdir(sourceOfCollections)
    return allFiles.filter(file => file.endsWith(".js"))
  }

  [requireCollections](sourceOfCollections, collectionFiles) {
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
          const schema = new Schema(this[createMongooseSchema](preDefinition))
          schemas.push(schema)
          return schema
        })
      })
      resolve(schemas)
    })
  }

  [createMongooseSchema](schemaDefinition) {
    const newSchema = { ...schemaDefinition }
    const schemaKeys = Object.keys(newSchema)
    schemaKeys.forEach(schemaKey => {
      const value = newSchema[schemaKey]
      if (Array.isArray(value)) {
        const arraySchema = this[createMongooseSchema](value[0])
        newSchema[schemaKey] = [arraySchema]
      } else if (value.isSchemaType) {
        newSchema[schemaKey] = MongoTypeFactory.create(value, newSchema)
      } else if (typeof value === "object") {
        newSchema[schemaKey] = this[createMongooseSchema](value)
      }
    })
    return newSchema
  }
}

module.exports = MongoSchemaService
