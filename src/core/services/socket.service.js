const onSocketConnected = Symbol("onSocketConnected")
const onSocketDisconnected = Symbol("onSocketDisconnected")

class SocketService {

  get isInitialized() {
    return socketEngine.isInitialized()
  }

  constructor(collectionRepo, socketEngine) {
    this.collectionRepo = collectionRepo
    this.socketEngine = socketEngine
    this.socketEngine.setConnectedListener.bind(this)
    this.socketEngine.setOnDisconnectedListener.bind(this)
    this.socketEngine.setConnectedListener(user => this[onSocketConnected](user, collectionRepo))
    this.socketEngine.setOnDisconnectedListener(user => this[onSocketDisconnected](user, collectionRepo))
  }

  init(server) {
    this.socketEngine.init(server)
  }

  createChannel(channel) { return this.socketEngine.createChannel(channel) }

  notifyAddCollectionItem(schema, item) { this.socketEngine.notifyAddCollectionItem(schema, item) }

  notifyRemoveCollectionItem(schema, item) { this.socketEngine.notifyRemoveCollectionItem(schema, item) }

  notifyUpdateCollection(schema, items) { this.socketEngine.notifyUpdateCollection(schema, item) }

  notifyUpdateCollectionItem(schema, item) { this.socketEngine.notifyUpdateCollectionItem(schema, item) }

  findSocket(token, address) { this.socketEngine.findSocket(token, address) }

  closeConnection(token, address) { this.socketEngine.closeConnection(token, address) }

  sendBroadcast(message, channel) { this.socketEngine.broadCast(message, channel) }

  subscribeOn(event, channel) { this.socketEngine.subscribeOn(event, channel) }

  [onSocketDisconnected](user, collectionRepo) {
    collectionRepo
      .updateItem("Profile", user.id, { isOnline: false, connectedSince: null })
      .then(result => {
        console.log("Disconnected: ", user)
      })
      .catch(error => {
        console.log("Error: ", error)
      })
  }

  [onSocketConnected](user, collectionRepo) {
    collectionRepo
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

module.exports = SocketService