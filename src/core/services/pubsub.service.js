class PubSubService {
  init(socketService, server) {
    if(!socketService || !server) return
    this.socketService = socketService
    this.socketService.init(server)
  }

  createChannel(channelName) {
    var socketResult = this.socketService.createChannel(channelName)

    // TODO: Do other steps before delivering the result if neccessary

    return socketResult
  }

  sendBroadcast(message, channelName) {
    this.socketService.sendBroadcast(message, channelName)
  }

  notifyAddCollectionItem(schema, item) {
    this.socketService.notifyAddCollectionItem(schema, item)
  }

  notifyRemoveItem(schema, item) {
    this.socketService.notifyRemoveCollectionItem(schema, item)
  }

  notifyUpdateCollection(schema, items) {
    this.socketService.notifyUpdateCollection(schema, items)
  }

  notifyUpdateCollectionItem(schema, item) {
    this.socketService.notifyUpdateCollectionItem(schema, item)
  }

  setOnDisconnectedListener(onDisconnectListener) {
    this.socketService.setOnDisconnectedListener(onDisconnectListener)
  }
}

module.exports = new PubSubService()