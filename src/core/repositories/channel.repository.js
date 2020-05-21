const SOCKET = require("../services/socket.key")
const ERROR = require("../services/error.key")
const Minio = require("../minio.app")

class ChannelRepository {
  constructor() {}

  broadCast(data, channel, socket) {
    channel.emit(SOCKET.EVENT_RECEIVE_BROADCAST, data) // Send the result back to the browser!
  }

  sendPrivateMessage(data, channel, socket) {
    var filtered = this._users.filter(item => {
      return item.profile.email === data.to
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
      var otherSocket = channel.sockets[user.socketId]
      if (!otherSocket) {
        var res = {
          success: false,
          error: ERROR.NO_SOCKETS_FOUND,
          key: SOCKET.COMMAND_SEND_PRIVATE_MESSAGE,
        }
        socket.emit(SOCKET.EVENT_ERROR, res)
      }
      otherSocket.emit(SOCKET.EVENT_RECEIVE_PRIVATE_MESSAGE, data)
    }
  }

  requestCollection(data, socket) {
    if (data && data.schema) {
      try {
        var Schema = Minio.instance.collection(data.schema)
        if (data.condition) {
          Schema.model
            .find()
            .where(data.whereKey, data.whereValue)
            .exec(function (err, items) {
              var res = { success: true, result: items, schema: data.schema }
              socket.emit(SOCKET.EVENT_RECEIVE_COLLECTION, res, data.schema)
            })
        } else {
          Schema.model.find().exec(function (err, items) {
            var res = { success: true, items: items, schema: data.schema }
            socket.emit(SOCKET.EVENT_RECEIVE_COLLECTION, res, data.schema)
          })
        }
      } catch (e) {
        var res = {
          success: false,
          error: JSON.stringify(e),
          key: SOCKET.COMMAND_REQUEST_COLLCECTION,
          schema: data.schema,
        }
        socket.emit(SOCKET.EVENT_ERROR, res)
      }
    } else {
      var res = {
        success: false,
        error: ERROR.PARAMETERS_INVALID,
        key: SOCKET.COMMAND_REQUEST_COLLECTION,
        schema: data.schema,
      }
      socket.emit(SOCKET.EVENT_ERROR, res)
    }
  }

  requestAiData(data, socket) {
    let apiaiReq = apiai.textRequest(data.message, {
      sessionId: secure.config.ai.apiai.sessionId,
    })

    apiaiReq.on("response", response => {
      let aiText = response.result.fulfillment.speech
      var data = { from: "CollectIO", message: aiText, type: "ai" }
      socket.emit(SOCKET.EVENT_RECEIVE_AI_DATA, data) // Send the result back to the browser!
    })

    apiaiReq.on("error", error => {
      var res = {
        success: false,
        error: JSON.stringify(error),
        key: SOCKET.COMMAND_REQUEST_AI_DATA,
      }
      socket.emit(SOCKET.EVENT_ERROR, res)
    })

    apiaiReq.end()
  }
}

module.exports = new ChannelRepository()
