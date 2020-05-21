const getChannel = Symbol("getChannel")
const onConnection = Symbol("onConnection")
const onUseApi = Symbol("onUseApi")
const onDisconnect = Symbol("onDisconnect")

const _ = require("lodash")
const jwt = require("jsonwebtoken")
const socketioJwt = require("socketio-jwt")

const SOCKET = require("./socket.key")
const emitQueue = require("../services/emit.queue")
const collectionRepo = require("./../repositories/collection.repository")
const channelRepo = require("./../repositories/channel.repository")

class SocketService {
  get isInitialized() {
    return this._io !== undefined && this._io != null
  }

  constructor() {
    this._channels = []
    this._users = []
    this._apiCalls = {}
  }

  init(server) {
    this._io = require("socket.io")(server)

    this._io.use(
      socketioJwt.authorize({
        secret: process.env.JWT_SECRET,
        handshake: true,
      })
    )
  }

  registerApi(apiName, callback) {
    this._apiCalls[apiName] = callback
  }

  createChannel(channelName) {
    var channel = this[getChannel](channelName)
    var success = false
    if (channel) {
      if (channel.initialized) success = true
      else {
        // Consider to use channel.once to avoid multiple events
        channel.on(SOCKET.EVENT_CONNECTION, socket => {
          this[onConnection](channel, socket)
        })
        channel.on(SOCKET.EVENT_OPEN, socket => {
          this[onConnection](channel, socket)
        })
        channel.use((socket, next) => {
          console.log(socket)
          next()
        })
        channel.initialized = true
        success = true
      }
    } else success = false
    return { success: success }
  }

  notifyAddItemCollection(schema, item) {
    if (!this.isInitialized) return
    emitQueue.enqueue(this._io, SOCKET.EVENT_COLLECTION_ADD_ITEM, {
      schema: schema,
      item: item,
      createdAt: item.createdAt,
    })
  }

  notifyRemoveItem(schema, item) {
    if (!this.isInitialized) return
    emitQueue.enqueue(this._io, SOCKET.EVENT_COLLECTION_REMOVE_ITEM, {
      schema: schema,
      item: item,
    })
  }

  notifyUpdateCollection(schema, items) {
    if (!this.isInitialized) return
    emitQueue.enqueue(this._io, SOCKET.EVENT_UPDATE, {
      schema: schema,
      items: items,
    })
  }

  notifyUpdateCollectionItem(schema, item) {
    if (!this.isInitialized) return
    emitQueue.enqueue(this._io, SOCKET.EVENT_COLLECTION_UPDATE_ITEM, {
      schema: schema,
      item: item,
    })
  }

  findSocket(token, address) {
    var user = jwt.decode(token)
    var key = user.profile.clientId + "/" + address
    var res = this._users.filter(function (item) {
      return item.key === key
    })
    return res
  }

  closeConnection(token, address) {
    console.log(this._channels)
  }

  [getChannel](channelId) {
    let channel
    const filtered = this._channels.filter(item => {
      return item.id === channelId
    })
    if (!filtered || filtered.length <= 0) {
      channel = this._io.of("/" + channelId)
      channel.id = channelId
      this._channels.push(channel)
    } else {
      channel = filtered[0]
    }
    return channel
  }

  [onUseApi](data, channel, socket) {
    apiCalls[data.apiName](data)
  }

  [onDisconnect](token, channel, socket) {
    socket.disconnect()
  }

  [onConnection](channel, socket) {
    var self = this

    socket.on(SOCKET.COMMAND_SEND_BROADCAST, data => {
      channelRepo.broadCast(data, channel, socket)
    })
    socket.on(SOCKET.COMMAND_REQUEST_AI_DATA, data => {
      channelRepo.requestAiData(data, socket)
    })
    socket.on(SOCKET.COMMAND_REQUEST_COLLECTION, data => {
      channelRepo.requestCollection(data, socket)
    })
    socket.on(SOCKET.COMMAND_SEND_PRIVATE_MESSAGE, data => {
      channelRepo.sendPrivateMessage(data, channel, socket)
    })
    socket.on(SOCKET.COMMAND_COLLECTION_ADD_ITEM, data => {
      channelRepo.addItem(data, channel, socket)
    })
    socket.on(SOCKET.COMMAND_COLLECTION_REMOVE_ITEM, data => {
      this._listener.removeItem(data, channel, socket)
    })
    socket.on(SOCKET.COMMAND_COLLECTION_UPDATE_ITEM, data => {
      this._listener.update(data, channel, socket)
    })
    socket.on(SOCKET.COMMAND_UPDATE, data => {
      this.channelRepo.update(data, channel, socket)
    })
    socket.on(SOCKET.COMMAND_USE_API, data => {
      this[onUseApi](data, channel, socket)
    })
    socket.on(SOCKET.COMMAND_DISCONNECT, data => {
      this[onDisconnect](data, channel, socket)
    })

    socket.on(SOCKET.EVENT_DISCONNECT, function (Socket, local) {
      console.log("Disconnect invoked")
      var user = undefined
      var toFindId = this.id
      self._users = self._users.filter(item => {
        if (item.socketId === toFindId) user = item
        return item.socketId !== toFindId
      })
      if (user === undefined) return
      user.isOnline = false

      collectionRepo
        .updateItem("Profile", user._id, { isOnline: false })
        .then(result => {
          console.log("Disconnected: ", user)
        })
        .catch(error => {
          console.log("Error: ", error)
        })
      channel.emit(SOCKET.EVENT_USER, this._users)
      emitQueue.enqueue(channel, SOCKET.EVENT_USER, this._users)
    })

    var userObj = jwt.decode(socket.handshake.query.token)

    if (!userObj) return

    userObj.socketId = socket.id
    userObj.key = userObj._id + "/" + socket.handshake.address
    userObj.isOnline = true
    userObj.connectedSince = Date.now()
    this._users.push(userObj)

    collectionRepo
      .updateItem("Profile", userObj._id, {
        connectedSince: userObj.connectedSince,
        isOnline: true,
      })
      .then(result => {
        console.log("Connected: ", userObj)
      })
      .catch(error => {
        console.log("Error: ", error)
      })

    // var delay = 501;
    // setTimeout(() => { channel.emit(SOCKET.EVENT_USER, this._users); }, delay);
    emitQueue.enqueue(channel, SOCKET.EVENT_USER, this._users)
  }

  sendBroadcast(message, channel) {}

  sendPrivateMessage(message, channel) {}

  setOnDisconnectedListener(onDisconectedListener) {
    this._onDisconnectedListener = onDisconectedListener
  }
}

module.exports = new SocketService()
