require("regenerator-runtime")

const SocketService = require("./../../../src/core/services/socket.service")
const collectionRepo = require("./../../../src/core/repositories/collection.repository")
const SocketEngine = require("./../../../src/core/services/socket.engine")

const chai = require("chai")
const sinon = require("sinon")
const expect = chai.expect
const faker = require("faker")
const { assert } = require("chai")

describe("SocketService", () => {

    // Arrange
    const stubbedRepo = sinon.stub(collectionRepo)
    const stubbedEngine = sinon.createStubInstance(SocketEngine)

    it("should not throw an exception", () => {
        // Arrange & Act
        const sut = new SocketService(stubbedRepo, stubbedEngine)
        
        // Assert
        expect(sut).is.not.null
    })

    it("should call init", () => {
        // Arrange
        const sut = new SocketService(stubbedRepo, stubbedEngine)

        // Act
        sut.init({})

        // Assert
        sinon.assert.calledOnce(stubbedEngine.init)
    })

    it("should call createChannel", () => {
        // Arrange
        const sut = new SocketService(stubbedRepo, stubbedEngine)
        const channelName = faker.name

        // Act
        sut.createChannel(channelName)

        // Assert
        sinon.assert.calledOnceWithExactly(stubbedEngine.createChannel, channelName)
    })
})