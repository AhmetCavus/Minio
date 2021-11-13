const getOrCreateChannel = Symbol("getOrCreateChannel")
const onConnection = Symbol("onConnection")
const onDisconnect = Symbol("onDisconnect")
const refreshUsers = Symbol("refreshUsers")
const initSocketEvents = Symbol("initSocketEvents")
const isNotInstanceOfServer = Symbol("isNotInstanceOfServer")

const http = require("http")
const https = require("https")
const _ = require("lodash")
const jwt = require("jsonwebtoken")
const socketAuthMiddleware = require('./../middleware/socket.auth')
const { Server } = require("socket.io")

const SOCKET = require("./socket.key")
const ERROR = require("./error.key")
const SocketConnectionException = require("../exceptions/socketconnection.exception")
const responseService = require("./response.service")
const { Socket } = require("dgram")

class SocketEngine {
  get isInitialized() {
    return this.io !== undefined && this.io != null
  }

  constructor() {
    this.channels = []
    this.users = []
    this.emitQueue = require("../services/emit.queue")
  }

  init(server, opt) {
    try {
      if(this[isNotInstanceOfServer](server)) throw new SocketConnectionException("Invalid parameter")
      this.io = new Server(server)
      process.env.JWT_SECRET = opt && opt.jwtSecret ? opt.jwtSecret : process.env.JWT_SECRET
      this.io.use(socketAuthMiddleware)
      this[getOrCreateChannel]("")
    } catch (error) {
      throw new SocketConnectionException(error)
    }
  }

  broadCast(data, channelName) {
    const channel = this[getOrCreateChannel](channelName.toLowerCase())
    channel.emit(SOCKET.EVENT_RECEIVE_BROADCAST, data)
  }

  createChannel(channelName) {
    const channel = this[getOrCreateChannel](channelName.toLowerCase())
    if (channel && !channel.initialized) {
      // Consider to use channel.once to avoid multiple events
      channel.on(SOCKET.EVENT_CONNECTION, socket => {
        this[onConnection](channel, socket)
      })
      channel.on(SOCKET.EVENT_OPEN, socket => {
        this[onConnection](channel, socket)
      })
      channel.initialized = true
    }
    if(channel !== null) return responseService.createSuccess("createdChannel", channelName);
    else return responseService.createFail();
  }

  notifyAddCollectionItem(schema, item) {
    if (!this.isInitialized) return
    this.emitQueue.enqueue(this.io, SOCKET.EVENT_COLLECTION_ADD_ITEM, {
      schema: schema,
      item: item,
      createdAt: item.createdAt,
    })
  }

  notifyRemoveCollectionItem(schema, item) {
    if (!this.isInitialized) return
    this.emitQueue.enqueue(this.io, SOCKET.EVENT_COLLECTION_REMOVE_ITEM, {
      schema: schema,
      item: item,
    })
  }

  notifyUpdateCollection(schema, items) {
    if (!this.isInitialized) return
    this.emitQueue.enqueue(this.io, SOCKET.EVENT_UPDATE, {
      schema: schema,
      items: items,
    })
  }

  notifyUpdateCollectionItem(schema, item) {
    if (!this.isInitialized) return
    this.emitQueue.enqueue(this.io, SOCKET.EVENT_COLLECTION_UPDATE_ITEM, {
      schema: schema,
      item: item,
    })
  }

  notifyUsersChanged(channel) {
    if (!this.isInitialized) return
    this.emitQueue.enqueue(channel, SOCKET.EVENT_USER, this.users)
  }

  findSocket(token, address) {
    var user = jwt.decode(token)
    var key = user.profile.clientId + "/" + address
    var res = this.users.filter(function (item) {
      return item.key === key
    })
    return res
  }

  closeConnection(token, address) {
    console.log(this._channels)
  }

  sendPrivateMessage(data, channel, socket) {
    var filtered = this.users.filter(profile => {
      return profile.id === data.to
    })
    if (!filtered || filtered.length <= 0) {
      var res = {
        success: false,
        error: ERROR.NO_USERS_FOUND,
        key: SOCKET.COMMAND_SEND_PRIVATE_MESSAGE,
      }
      socket.emit(SOCKET.EVENT_ERROR, res)
    } else {
      var user = filtered[0]
      var otherSocket = channel.sockets.get(user.socketId)
      if (!otherSocket) {
        var res = {
          success: false,
          error: ERROR.NO_SOCKETS_FOUND,
          key: SOCKET.COMMAND_SEND_PRIVATE_MESSAGE,
        }
        socket.emit(SOCKET.EVENT_ERROR, res)
      } else {
        otherSocket.emit(SOCKET.EVENT_RECEIVE_PRIVATE_MESSAGE, data)
      }
    }
  }

  requestCollection(data, socket) {
    if (data && data.schema) {
      try {
        const Schema = require("../minio.app").Instance.collection(data.schema)
        if (data.condition) {
          Schema.model
            .find()
            .where(data.whereKey, data.whereValue)
            .exec(function (err, items) {
              const res = { success: true, result: items, schema: data.schema }
              socket.emit(SOCKET.EVENT_RECEIVE_COLLECTION, res, data.schema)
            })
        } else {
          Schema.model.find().exec(function (err, items) {
            const res = { success: true, items: items, schema: data.schema }
            socket.emit(SOCKET.EVENT_RECEIVE_COLLECTION, res, data.schema)
          })
        }
      } catch (e) {
        const res = {
          success: false,
          error: JSON.stringify(e),
          key: SOCKET.COMMAND_REQUEST_COLLCECTION,
          schema: data.schema,
        }
        socket.emit(SOCKET.EVENT_ERROR, res)
      }
    } else {
      const res = {
        success: false,
        error: ERROR.PARAMETERS_INVALID,
        key: SOCKET.COMMAND_REQUEST_COLLECTION,
        schema: data.schema,
      }
      socket.emit(SOCKET.EVENT_ERROR, res)
    }
  }

  setConnectedListener(connectedListener) {
    this.onConnectedListener = connectedListener
  }

  setOnDisconnectedListener(onDisconectedListener) {
    this.onDisconnectedListener = onDisconectedListener
  }

  [isNotInstanceOfServer](server) {
    const result = (server instanceof http.Server) || (server instanceof https.Server)
    return !result
  }

  subscribeOn(event, channel, callback) {
    const socket = this[getOrCreateChannel](channel)
    if(socket === null) return
    socket.on(event, callback)
  }

  [getOrCreateChannel](channelId) {
    let channel
    const filtered = this.channels.filter(item => {
      return item.id === channelId
    })
    if (!filtered || filtered.length <= 0) {
      channel = this.io.of("/" + channelId)
      channel.use(socketAuthMiddleware)
      channel.id = channelId
      this.channels.push(channel)
    } else {
      channel = filtered[0]
    }
    return channel
  }

  [onDisconnect](token, channel, socket) {
    socket.disconnect()
  }

  [onConnection](channel, socket) {
    this[initSocketEvents](channel, socket)
    this[refreshUsers](channel, socket)
  };

  [initSocketEvents](channel, socket) {
    socket.on(SOCKET.COMMAND_SEND_BROADCAST, data => {
      this.broadCast(data, channel, socket)
    })
    socket.on(SOCKET.COMMAND_REQUEST_COLLECTION, data => {
      this.requestCollection(data, socket)
    })
    socket.on(SOCKET.COMMAND_SEND_PRIVATE_MESSAGE, data => {
      this.sendPrivateMessage(data, channel, socket)
    })
    socket.on(SOCKET.COMMAND_COLLECTION_ADD_ITEM, data => {
      this.notifyAddCollectionItem(data, channel, socket)
    })
    socket.on(SOCKET.COMMAND_COLLECTION_REMOVE_ITEM, data => {
      this.notifyRemoveCollectionItem(data, channel, socket)
    })
    socket.on(SOCKET.COMMAND_COLLECTION_UPDATE_ITEM, data => {
      this.notifyUpdateCollectionItem(data, channel, socket)
    })
    socket.on(SOCKET.COMMAND_UPDATE, data => {
      this.notifyUpdateCollection(data, channel, socket)
    })
    socket.on(SOCKET.COMMAND_DISCONNECT, data => {
      this[onDisconnect](data, channel, socket)
    })

    socket.on(SOCKET.EVENT_DISCONNECT, () => {
      let user = undefined
      const toFindId = socket.id
      const copiedUsers = [...this.users]
      const filteredUsers = copiedUsers.filter(item => {
        if (item.socketId === toFindId) user = item
        return item.socketId !== toFindId
      })
      if (user === undefined) return
      user.isOnline = false
      this.users = filteredUsers
      this.onDisconnectedListener(user)
      this.notifyUsersChanged(channel)
    })
  };

  [refreshUsers](channel, socket) {
    const user = jwt.decode(socket.handshake.query.token)
    if (!user) return
    user.socketId = socket.id
    user.key = user._id + "/" + socket.handshake.address
    user.isOnline = true
    user.connectedSince = Date.now()
    this.users.push(user)
    this.onConnectedListener(user)
    this.notifyUsersChanged(channel)
  }
}

module.exports = SocketEngine
