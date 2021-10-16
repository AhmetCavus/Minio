const SOCKET = require("../services/socket.key")
const ERROR = require("../services/error.key")
const resolveSchema = Symbol("resolveSchema")
const _ = require("lodash")
const CollectionHelper = require("./../helper/collection.helper")
const { isUndefined, isEmpty } = require("lodash")

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

  async recursiveAddItems(schema, content, children) {
    return new Promise(async (resolve, reject) => {
      if(_.isEmpty(content)) return

      try {
        for (const child of children) {
          let subChildren = CollectionHelper.resolveSubSchemasFromBody(content[child])
          let createdItem = await this.recursiveAddItems(child, content[child], subChildren)
          content[child] = createdItem.id
        }
        let createdItem = await this.addItem(schema, content)
        resolve(createdItem)
      } catch (error) {
        reject(error)        
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
        } catch (err) {
          let res = { success: false, error: err }
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

  async recursiveUpdateItems(schema, id, content, children) {
    return new Promise(async (resolve, reject) => {
      if(_.isEmpty(content)) return
      const collection = await this.getCollection(schema)
      const itemFromDb = _(collection).first(item => item.id === id)
      const contentWithIds = {...content}
      for (const child of children) {
        const childContent = content[child]
        if(!isEmpty(childContent.id)) {
          contentWithIds[child] = childContent.id
        }
        else if(isUndefined(itemFromDb[child])) {
          const subChildren = CollectionHelper.resolveSubSchemasFromBody(childContent)
          const createdChild = await this.recursiveAddItems(child, childContent, subChildren)
          itemFromDb[child] = createdChild.id
          contentWithIds[child] = itemFromDb[child]
        } else {
          contentWithIds[child] = itemFromDb[child]
        }
      }
      try {
        let updatedItem = await this.updateItem(schema, id, contentWithIds)
        for (const child of children) {
          let subChildren = CollectionHelper.resolveSubSchemasFromBody(content[child])
          let updatedChildItem = await this.recursiveUpdateItems(child, updatedItem[child], content[child], subChildren)
          content[child] = updatedChildItem
        }
        resolve(updatedItem)
      } catch (error) {
        reject(error)        
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

  getCollection(schema, relations, isJson, date) {
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
                let result = {}
                if(isJson) {
                  result = _(items).map(i => { return { json: JSON.stringify(i) }})
                } else {
                  result = items
                }
                resolve(result)
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
    const Schema = Minio.Instance.collection(schema)
    if (!Schema) {
      throw new Error(`No schema named ${schema} registered.`)
    }
    return Schema
  }
}

module.exports = new CollectionRepository()
