const socketService = require("./socket.service")()
const mqttService = require("./mqttService")()

class PubSubService {
  init(server) {
    socketService.init(server)
    mqttService.init(server)
  }

  auth() {}

  createChannel(channelName) {
    var socketResult = socketService.createChannel(channelName)
    var mqttResult = mqttService.createChannel(channelName)

    // TODO: Do other steps before delivering the result if neccessary

    return socketResult
  }

  sendBroadcast(message, channelName) {
    socketService.sendBroadcast(message, channelName)
    mqttService.sendBroadcast(message, channelName)
  }

  notifyAddItemCollection(schema, item) {
    socketService.notifyAddItemCollection(schema, item)
    mqttService.notifyAddItemCollection(schema, item)
  }

  notifyRemoveItem(schema, item) {
    socketService.notifyRemoveItem(schema, item)
    mqttService.notifyRemoveItem(schema, item)
  }

  notifyUpdateCollection(schema, items) {
    socketService.notifyUpdateCollection(schema, items)
    mqttService.notifyUpdateCollection(schema, items)
  }

  notifyUpdateCollectionItem(schema, item) {
    socketService.notifyUpdateCollectionItem(schema, item)
    mqttService.notifyUpdateCollectionItem(schema, item)
  }

  setOnDisconnectedListener(onDisconnectListener) {
    socketService.setOnDisconnectedListener(onDisconnectListener)
  }
}

var pubSubService
module.exports = () => {
  if (!pubSubService) pubSubService = new PubSubService()
  return pubSubService
}
