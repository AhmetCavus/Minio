require("regenerator-runtime")
const _ = require("lodash")

const MinioApp = require("./../../../src/core/minio.app")

const chai = require("chai")
const sinon = require("sinon")
const expect = chai.expect
const faker = require("faker")
const { isObject } = require("lodash")

describe("CollectionController", () => {
  describe("#addCollectionItem", () => {
    it("should determine all schemas", () => {
        const existingSchemas = ["test", "test2", "category"]
        const body = {
            "title": "Todo 3",
            "description": "Desc 3",
            "category": {
                "name": "New Category 4",
                "description": "Test description 3",
                "image": "https://lorem.picsum.com/300"
            },
            "tasks": [
                {
                    "title": "Task 1",
                    "description": "Desc 1"
                }
            ],
            "test": {
                
            }
        }
        const foundSubSchemas = _.intersection(existingSchemas, Object.keys(body).filter(k => isObject(body[k])))
        console.log(foundSubSchemas)
    })
  })
})