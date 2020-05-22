const socketService = require("./socket.service")

class PubSubService {
  constructor(server) {
    socketService.init(server)
    console.log("PubSub Service created")
  }

  createChannel(channelName) {
    var socketResult = socketService.createChannel(channelName)

    // TODO: Do other steps before delivering the result if neccessary

    return socketResult
  }

  sendBroadcast(message, channelName) {
    socketService.sendBroadcast(message, channelName)
  }

  notifyAddCollectionItem(schema, item) {
    socketService.notifyAddCollectionItem(schema, item)
  }

  notifyRemoveItem(schema, item) {
    socketService.notifyRemoveCollectionItem(schema, item)
  }

  notifyUpdateCollection(schema, items) {
    socketService.notifyUpdateCollection(schema, items)
  }

  notifyUpdateCollectionItem(schema, item) {
    socketService.notifyUpdateCollectionItem(schema, item)
  }

  setOnDisconnectedListener(onDisconnectListener) {
    socketService.setOnDisconnectedListener(onDisconnectListener)
  }
}

let instance
module.exports = server => {
  if (!instance) {
    if (!server) return
    instance = new PubSubService(server)
  }
  return instance
}
