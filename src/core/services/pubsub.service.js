class PubSubService {
  init(socketService, server) {
    if(!socketService || !server) return
    this.socketService = socketService
    this.socketService.init(server)
  }

  createChannel(channel) {
    var socketResult = this.socketService.createChannel(channel)

    // TODO: Do other steps before delivering the result if neccessary

    return socketResult
  }

  sendBroadcast(message, channel) {
    this.socketService.sendBroadcast(message, channel)
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

  subscribeOn(event, channel) {
    this.socketService.subscribeOn(event, channel);
  }
}

module.exports = new PubSubService()