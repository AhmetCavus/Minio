require("regenerator-runtime")

const {Server} = require("http")
const chai = require("chai")
const sinon = require("sinon")
const expect = chai.expect
const faker = require("faker")
const { assert } = require("chai")
const socketIo = require("socket.io")
const SOCKET = require("./../../../src/core/services/socket.key")
const SocketEngine = require("./../../../src/core/services/socket.engine")

const emitQueue = require("./../../../src/core/services/emit.queue")

describe("SocketEngine", () => {
    describe("init", () => {
        it("should throw an error if parameter is not valid", () => {
            // Arrange
            const socketEngine = new SocketEngine()
            const invalidParameter = {}
            
            // Act + Assert
            assert.throws(() => {
                socketEngine.init(invalidParameter)
            }, Error) 
        })
    })
    describe("broadcast", () => {
        it("should call emit of the channel", () => {
            // Arrange
            const socketEngine = new SocketEngine()
            const stubbedChannel = sinon.createStubInstance(socketIo.Namespace) 
            const data = faker.datatype.uuid()

            // Act
            socketEngine.broadCast(data, stubbedChannel)

            // Assert
            sinon.assert.calledWith(stubbedChannel.emit, SOCKET.EVENT_RECEIVE_BROADCAST, data)
        })
    })
    describe("isInitialized", () => {
        it("should return true", () => {
            // Arrange
            const socketEngine = new SocketEngine()
            const server = new Server() 

            // Act
            socketEngine.init(server)
            const isInitialized = socketEngine.isInitialized

            // Assert
            expect(isInitialized).is.true
        })
    })
    describe("createChannel", () => {
        it("should create the channel object", () => {
            // Arrange
            const socketEngine = new SocketEngine()
            const server = new Server() 
            const channelName = faker.datatype.uuid()

            // Act
            socketEngine.init(server)
            const channel = socketEngine.createChannel(channelName)

            // Assert
            expect(channel).is.not.undefined.and.not.null
        })
    })
    describe("notifyAddCollectionItem", () => {
        it("should not throw an exception", () => {
            // Arrage
            const socketEngine = new SocketEngine()
            const server = new Server() 
            const scheme = faker.datatype.uuid()
            const item = faker.datatype.uuid()

            // Act
            socketEngine.init(server)

            // Assert
            assert.doesNotThrow(() => {
                socketEngine.notifyAddCollectionItem(scheme, item)
            })
        })
    })
    describe("notifyRemoveCollectionItem", () => {
        it("should not throw an exception", () => {
            // Arrage
            const socketEngine = new SocketEngine()
            const server = new Server() 
            const scheme = faker.datatype.uuid()
            const item = faker.datatype.uuid()

            // Act
            socketEngine.init(server)

            // Assert
            assert.doesNotThrow(() => {
                socketEngine.notifyRemoveCollectionItem(scheme, item)
            })
        })
    })
    describe("notifyUpdateCollection", () => {
        it("should not throw an exception", () => {
            // Arrage
            const socketEngine = new SocketEngine()
            const server = new Server() 
            const scheme = faker.datatype.uuid()
            const items = faker.datatype.uuid()

            // Act
            socketEngine.init(server)

            // Assert
            assert.doesNotThrow(() => {
                socketEngine.notifyUpdateCollection(scheme, items)
            })
        })
    })
    describe("notifyUpdateCollectionItem", () => {
        it("should not throw an exception", () => {
            // Arrage
            const socketEngine = new SocketEngine()
            const server = new Server() 
            const scheme = faker.datatype.uuid()
            const item = faker.datatype.uuid()

            // Act
            socketEngine.init(server)

            // Assert
            assert.doesNotThrow(() => {
                socketEngine.notifyUpdateCollectionItem(scheme, item)
            })
        })
    })
    describe("notifyUsersChanged", () => {
        it("should call enqueue once", () => {
            // Arrage
            const socketEngine = new SocketEngine()
            const server = new Server() 
            const stubbedChannel = sinon.createStubInstance(socketIo.Namespace)
            const stubbedEmit = sinon.stub(emitQueue)

            // Act
            socketEngine.init(server)
            socketEngine.notifyUsersChanged(stubbedChannel)

            // Assert
            sinon.assert.calledOnceWithExactly(stubbedEmit.enqueue, stubbedChannel, SOCKET.EVENT_USER, [])
        })
    })
})