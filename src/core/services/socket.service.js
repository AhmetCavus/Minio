const onSocketConnected = Symbol("onSocketConnected")
const onSocketDisconnected = Symbol("onSocketDisconnected")

class SocketService {
  get isInitialized() {
    return socketEngine.isInitialized()
  }

  constructor() {
    this.collectionRepo = require("./../repositories/collection.repository")
    this.socketEngine = require("./socket.engine")
    this.socketEngine.setConnectedListener(this[onSocketConnected])
    this.socketEngine.setOnDisconnectedListener(this[onSocketDisconnected])
  }

  init(server) {
    this.socketEngine.init(server)
  }

  createChannel(channelName) { this.socketEngine.createChannel(channelName) }

  notifyAddCollectionItem(schema, item) { this.socketEngine.notifyAddCollectionItem(schema, item) }

  notifyRemoveCollectionItem(schema, item) { this.socketEngine.notifyRemoveCollectionItem(schema, item) }

  notifyUpdateCollection(schema, items) { this.socketEngine.notifyUpdateCollection(schema, item) }

  notifyUpdateCollectionItem(schema, item) { this.socketEngine.notifyUpdateCollectionItem(schema, item) }

  findSocket(token, address) { this.socketEngine.findSocket(token, address) }

  closeConnection(token, address) { this.socketEngine.closeConnection(token, address) }

  [onSocketDisconnected](user) {
    this.collectionRepo
      .updateItem("Profile", user.id, { isOnline: false, connectedSince: null })
      .then(result => {
        console.log("Disconnected: ", user)
      })
      .catch(error => {
        console.log("Error: ", error)
      })
  }

  [onSocketConnected](user) {
    this.collectionRepo
      .updateItem("Profile", user.id, {
        isOnline: true,
        connectedSince: Date.now(),
      })
      .then(result => {
        console.log("Connected: ", user)
      })
      .catch(error => {
        console.log("Error: ", error)
      })
  }
}

module.exports = new SocketService()
