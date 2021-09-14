require("regenerator-runtime")

const chai = require("chai")
const sinon = require("sinon")
const expect = chai.expect
const faker = require("faker")
const { assert } = require("chai")
const socketIo = require("socket.io")
const SocketEngine = require("./../../../src/core/services/socket.engine")
const SocketConnectionException = require("./../../../src/core/exceptions/socketconnection.exception")
const SOCKET = require("./../../../src/core/services/socket.key")

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
})