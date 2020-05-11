const chai = require("chai")
const expect = chai.expect

const SchemaServiceFactory = require("./../../../src/core/db/db.schema.factory")
const SupportedEngine = require("./../../../src/core/db/supported.engine")

describe("DbSchemaFactory", () => {
  describe("#createSchemaService", () => {
    it("should not return undefined and null", async () => {
      const schemaService = SchemaServiceFactory.createSchemaService(
        SupportedEngine.MongoDb
      )
      expect(schemaService).is.not.undefined.and.not.null
    })
  })
})
