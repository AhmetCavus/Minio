const SOCKET = require("../services/socket.key")
const ERROR = require("../services/error.key")
const resolveSchema = Symbol("resolveSchema")

class CollectionRepository {
  update(schema, content) {
    return new Promise((resolve, reject) => {
      if (schema && content) {
        try {
          if (
            typeof content.json === "string" ||
            content.json instanceof String
          ) {
            content = JSON.parse(content.json)
          }
          const Schema = this[resolveSchema](schema)
          Schema.model.remove(err => {
            if (err)
              reject({
                success: false,
                message: err,
                key: SOCKET.COMMAND_UPDATE,
              })
            else {
              Schema.model.insertMany(content, (err, docs) => {
                if (err)
                  reject({
                    success: false,
                    error: e,
                    key: SOCKET.COMMAND_UPDATE,
                  })
                else resolve(docs)
              })
            }
          })
        } catch (e) {
          reject({ success: false, error: e, key: SOCKET.COMMAND_UPDATE })
        }
      } else {
        reject({
          success: false,
          error: ERROR.PARAMETERS_INVALID,
          key: SOCKET.COMMAND_UPDATE,
        })
      }
    })
  }

  addItem(schema, content) {
    return new Promise((resolve, reject) => {
      if (schema && content) {
        try {
          if (
            typeof content.json === "string" ||
            content.json instanceof String
          ) {
            content = JSON.parse(content.json)
          }
          const Schema = this[resolveSchema](schema)
          if (content._id !== undefined) delete content._id
          var newItem = new Schema.model(content)
          newItem.save((err, doc) => {
            if (err) {
              var res = {
                success: false,
                message: err,
                key: SOCKET.COMMAND_COLLECTION_ADD_ITEM,
              }
              reject(res)
            } else {
              resolve(doc)
            }
          })
        } catch (e) {
          var res = { success: false, message: e }
          reject(res)
        }
      } else {
        var res = {
          success: false,
          message: ERROR.PARAMETERS_INVALID,
          key: SOCKET.COMMAND_COLLECTION_ADD_ITEM,
        }
        reject(res)
      }
    })
  }

  updateItem(schema, id, content) {
    return new Promise((resolve, reject) => {
      if (schema && content) {
        try {
          if (
            typeof content.json === "string" ||
            content.json instanceof String
          ) {
            content = JSON.parse(content.json)
          }
          const Schema = this[resolveSchema](schema)
          Schema.model
            .findOneAndUpdate({ _id: id }, content, { new: true })
            .exec((err, updatedDoc) => {
              if (err) {
                var res = {
                  success: false,
                  error: err,
                  key: SOCKET.COMMAND_COLLECTION_UPDATE_ITEM,
                }
                reject(res)
              } else {
                resolve(updatedDoc)
              }
            })
        } catch (e) {
          var res = { success: false, error: e }
          reject(res)
        }
      } else {
        var res = {
          success: false,
          error: ERROR.PARAMETERS_INVALID,
          key: SOCKET.COMMAND_COLLECTION_UPDATE_ITEM,
        }
        reject(res)
      }
    })
  }

  removeItem(schema, id) {
    return new Promise((resolve, reject) => {
      if (schema && id) {
        try {
          const Schema = this[resolveSchema](schema)
          Schema.model.findOneAndRemove({ _id: id }).exec((err, result) => {
            if (err) {
              var res = {
                success: false,
                error: err,
                key: SOCKET.COMMAND_COLLECTION_REMOVE_ITEM,
              }
              reject(res)
            } else {
              resolve(result)
            }
          })
        } catch (e) {
          var res = { success: false, error: e }
          reject(res)
        }
      } else {
        var res = {
          success: false,
          error: ERROR.PARAMETERS_INVALID,
          key: SOCKET.COMMAND_COLLECTION_REMOVE_ITEM,
        }
        reject(res)
      }
    })
  }

  getCollection(schema, relations, date) {
    return new Promise((resolve, reject) => {
      if (schema) {
        try {
          const Schema = this[resolveSchema](schema)
          let filter = {}
          if (date !== undefined)
            filter = { createdAt: { $gte: new Date(date) } }
          Schema.model
            .find(filter)
            .select()
            .populate(relations)
            .exec((err, items) => {
              if (err) {
                reject(err)
              } else {
                resolve(items)
              }
            })
        } catch (err) {
          reject(err)
        }
      } else {
        var err = { error: ERROR.PARAMETERS_INVALID }
        reject(err)
      }
    })
  }

  [resolveSchema](schema) {
    const Minio = require("../minio.app")
    const Schema = Minio.instance.collection(schema)
    if (!Schema) {
      throw new Error(`No schema named ${schema} registered.`)
    }
    return Schema
  }
}

module.exports = new CollectionRepository()
