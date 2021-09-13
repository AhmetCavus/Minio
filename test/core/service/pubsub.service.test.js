require("regenerator-runtime")

const SocketService = require("./../../../src/core/services/socket.service")
const pubSubService = require("./../../../src/core/services/pubsub.service")

const chai = require("chai")
const sinon = require("sinon")
const expect = chai.expect
const faker = require("faker")
const { assert } = require("chai")

describe("PubSubService", () => {
    describe("createChannel", () => {
        it("should return expected result", () => {
            // Arrange
            const channel = faker.lorem.word(10)
            const stubbedSocketService = sinon.createStubInstance(SocketService)
            stubbedSocketService.createChannel.withArgs(channel).returns({ success: true, channel: channel })
            pubSubService.init(stubbedSocketService, {})

            // Act
            const result = pubSubService.createChannel(channel)
    
            // Assert
            expect(result.channel).equal(channel)
        })
    })
    describe("notifyAddCollectionItem", () => {
        it("should call notifyAddCollectionItem with given arguments", () => {
            // Arrange
            const schema = faker.lorem.word(10)
            const item = faker.datatype.uuid()
            const stubbedSocketService = sinon.createStubInstance(SocketService)
            pubSubService.init(stubbedSocketService, {})

            // Act
            pubSubService.notifyAddCollectionItem(schema, item)
    
            // Assert
            stubbedSocketService.notifyAddCollectionItem.calledWith(schema, item)
        })
    })
    describe("notifyAddCollectionItem", () => {
        it("should call notifyRemoveItem with given arguments", () => {
            // Arrange
            const schema = faker.lorem.word(10)
            const item = faker.datatype.uuid()
            const stubbedSocketService = sinon.createStubInstance(SocketService)
            pubSubService.init(stubbedSocketService, {})

            // Act
            pubSubService.notifyRemoveItem(schema, item)
    
            // Assert
            stubbedSocketService.notifyRemoveCollectionItem.calledWith(schema, item)
        })
    })
    describe("notifyUpdateCollection", () => {
        it("should call notifyUpdateCollection with given arguments", () => {
            // Arrange
            const schema = faker.lorem.word(10)
            const item = faker.datatype.uuid()
            const stubbedSocketService = sinon.createStubInstance(SocketService)
            pubSubService.init(stubbedSocketService, {})

            // Act
            pubSubService.notifyUpdateCollection(schema, item)
    
            // Assert
            stubbedSocketService.notifyUpdateCollection.calledWith(schema, item)
        })
    })
    describe("notifyUpdateCollectionItem", () => {
        it("should call notifyUpdateCollectionItem with given arguments", () => {
            // Arrange
            const schema = faker.lorem.word(10)
            const item = faker.datatype.uuid()
            const stubbedSocketService = sinon.createStubInstance(SocketService)
            pubSubService.init(stubbedSocketService, {})

            // Act
            pubSubService.notifyUpdateCollectionItem(schema, item)
    
            // Assert
            stubbedSocketService.notifyUpdateCollectionItem.calledWith(schema, item)
        })
    })
    describe("sendBroadcast", () => {
        it("should call sendBroadcast with given arguments", () => {
            // Arrange
            const message = faker.lorem.word(10)
            const channel = faker.datatype.uuid()
            const stubbedSocketService = sinon.createStubInstance(SocketService)
            pubSubService.init(stubbedSocketService, {})

            // Act
            pubSubService.sendBroadcast(message, channel)
    
            // Assert
            stubbedSocketService.sendBroadcast.calledWith(message, channel)
        })
    })
})