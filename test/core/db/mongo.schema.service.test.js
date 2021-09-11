const path = require("path")
const SchemaServiceFactory = require("./../../../src/core/db/db.schema.factory")
const SupportedEngine = require("./../../../src/core/db/supported.engine")

const chai = require("chai")
chai.use(require("chai-string"))

const sinon = require("sinon")
const assert = require("assert")
const expect = chai.expect
const faker = require("faker")

describe("SchemaService", () => {
  describe("#resolveSchemas", () => {
    const schemaService = SchemaServiceFactory.createSchemaService(
      SupportedEngine.MongoDb
    )

    const pathToSchemas = path.join(__dirname, "..", "models")

    it("should not return null", async () => {
      const schemas = await schemaService.resolveCollections(pathToSchemas)
      expect(schemas).is.not.null
    })

    it("should return objects with a name property", async () => {
      const schemas = await schemaService.resolveCollections(pathToSchemas)
      Object.keys(schemas).forEach(key =>
        expect(schemas[key]).has.property("name")
      )
    })
  })
})
