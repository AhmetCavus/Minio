const DbService = require("./../../../src/core/db/db.service")
const MongoAdapter = require("./../../../src/core/db/mongo.adapter")

const mongoose = require("mongoose")
const Schema = mongoose.Schema

const chai = require("chai")
chai.use(require("chai-string"))

const sinon = require("sinon")
const assert = require("assert")
const expect = chai.expect
const faker = require("faker")

describe("DbService", () => {
  const dbService = new DbService(new MongoAdapter())

  var testSchema = new Schema({
    name: String,
    type: String,
    tags: { type: [String], index: true }, // field level
  })

  var testSchema2 = new Schema({
    title: String,
    type: String,
    tags: { type: [String], index: true }, // field level
  })

  const schemaDefinitions = [
    { name: "TestModel", schema: testSchema },
    { name: "Test2Model", schema: testSchema2 },
  ]

  describe("#registerSchemas", () => {
    it("should register the schemas", () => {
      const models = dbService.registerCollections(schemaDefinitions)
      chai.assert.typeOf(models, "Object")
    })

    it("should retrieve models named like expected", () => {
      const models = dbService.registerCollections(schemaDefinitions)
      expect(models).to.have.all.keys(["TestModel", "Test2Model"])
    })
  })
})
