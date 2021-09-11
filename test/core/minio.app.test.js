const MinioApp = require("./../../src/core/minio.app")

const chai = require("chai")
const sinon = require("sinon")
const expect = chai.expect
const faker = require("faker")

describe("MinioApp", () => {
  describe("#create Minio App", () => {
    it("should not throw an exception", () => {
      const app = new MinioApp.App()
      expect(app).is.not.null
    })
  })
})