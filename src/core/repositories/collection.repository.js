const resolveSchema = Symbol("resolveSchema")
const findItem = Symbol("findItem")

const ERROR = require("../services/error.key")
const _ = require("lodash")
const CollectionHelper = require("./../helper/collection.helper")
const responseService = require("./../services/response.service")
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
              reject(responseService.createFailContent(err, ERROR.RUNTIME_EXCEPTION))
            else {
              Schema.model.insertMany(content, (err, docs) => {
                if (err)
                  reject(responseService.createFailContent(err, ERROR.RUNTIME_EXCEPTION))
                else resolve(docs)
              })
            }
          })
        } catch (err) {
          reject(responseService.createFailContent(err, ERROR.RUNTIME_EXCEPTION))
        }
      } else {
        reject(responseService.createFailContent(err, ERROR.PARAMETERS_INVALID))
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
              if(err.code === ERROR.DB_DUPLICATE_KEY_ERROR) {
                this[findItem](schema, err.keyValue)
                  .then(doc => { resolve(doc) })
                  .catch(err => reject(responseService.createFailContent(err, ERROR.CREATE_FAILED))) 
              } else {
                reject(responseService.createFailContent(err, ERROR.CREATE_FAILED))
              }
          } else {
              resolve(doc)
            }
          })
        } catch (e) {
          var res = { message: e }
          reject(res)
        }
      } else {
        reject(responseService.createFailContent(err, ERROR.PARAMETERS_INVALID))
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
      } catch (err) {
        reject(responseService.createFailContent(err, ERROR.RUNTIME_EXCEPTION))       
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
                reject(responseService.createFailContent(err, ERROR.RUNTIME_EXCEPTION))
              } else {
                resolve(updatedDoc)
              }
            })
        } catch (err) {
          let res = { success: false, error: err }
          reject(res)
        }
      } else {
        reject(responseService.createFailContent(err, ERROR.PARAMETERS_INVALID))
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
      } catch (err) {
        reject(responseService.createFailContent(err, ERROR.RUNTIME_EXCEPTION))     
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
              reject(responseService.createFailContent(err, ERROR.RUNTIME_EXCEPTION))
            } else {
              resolve(result)
            }
          })
        } catch (err) {
          reject(responseService.createFailContent(err, ERROR.RUNTIME_EXCEPTION))
        }
      } else {
        reject(responseService.createFailContent(undefined, ERROR.PARAMETERS_INVALID))
      }
    })
  }

  getCollection(schema, date) {
    return new Promise((resolve, reject) => {
      if (schema) {
        try {
          const Schema = this[resolveSchema](schema)
          let filter = {}
          if (date !== undefined)
            filter = { createdAt: { $gte: new Date(date) } }
          Schema.model
            .find(filter)
            .select('-__v')
            .exec((err, items) => {
              if (err) {
                reject(responseService.createFailContent(err, ERROR.RUNTIME_EXCEPTION))
              } else {
                resolve(items)
              }
            })
        } catch (err) {
          reject(responseService.createFailContent(err, ERROR.RUNTIME_EXCEPTION))
        }
      } else {
        reject(responseService.createFailContent(undefined, ERROR.PARAMETERS_INVALID))
      }
    })
  }

  getPopulatedCollection(schema, date) {
    return new Promise((resolve, reject) => {
      if (schema) {
        try {
          const Schema = this[resolveSchema](schema)
          const populationOption = CollectionHelper.resolveReferencesFromSchema(schema, this[resolveSchema])
          let filter = {}
          if (date !== undefined)
            filter = { createdAt: { $gte: new Date(date) } }
          Schema.model
            .find(filter)
            .select('-__v')
            .populate(populationOption)
            .exec((err, items) => {
              if (err) {
                reject(responseService.createFailContent(err, ERROR.RUNTIME_EXCEPTION))
              } else {
                resolve(items)
              }
            })
        } catch (err) {
          reject(responseService.createFailContent(err, ERROR.RUNTIME_EXCEPTION))
        }
      } else {
        reject(responseService.createFailContent(undefined, ERROR.PARAMETERS_INVALID))
      }
    })
  }

  getItem(schema, id) {
    return new Promise((resolve, reject) => {
      if (schema && id) {
        try {
          const Schema = this[resolveSchema](schema)
          Schema
            .model
            .findOne({ _id: id })
            .select('-__v')
            .exec((err, result) => {
              if (err) {
                reject(responseService.createFailContent(err, ERROR.RUNTIME_EXCEPTION))
              } else {
                resolve(result)
              }
          })
        } catch (err) {
          reject(responseService.createFailContent(err, ERROR.RUNTIME_EXCEPTION))
        }
      } else {
        reject(responseService.createFailContent(undefined, ERROR.PARAMETERS_INVALID))
      }
    })
  }

  getPopulatedItem(schema, id) {
    return new Promise((resolve, reject) => {
      if (schema && id) {
        try {
          const Schema = this[resolveSchema](schema)
          const populationOption = CollectionHelper.resolveReferencesFromSchema(schema, this[resolveSchema])
          Schema
            .model
            .findOne({ _id: id })
            .select('-__v')
            .populate(populationOption)
            .exec((err, result) => {
              if (err) {
                reject(responseService.createFailContent(err, ERROR.RUNTIME_EXCEPTION))
              } else {
                resolve(result)
              }
          })
        } catch (err) {
          reject(responseService.createFailContent(err, ERROR.RUNTIME_EXCEPTION))
        }
      } else {
        reject(responseService.createFailContent(undefined, ERROR.PARAMETERS_INVALID))
      }
    })
  }

  [findItem](schema, findOptions) {
    return new Promise((resolve, reject) => {
      if (schema && findOptions) {
        try {
          const Schema = this[resolveSchema](schema)
          const populationOption = CollectionHelper.resolveReferencesFromSchema(schema, this[resolveSchema])
          Schema
            .model
            .findOne(findOptions)
            .select('-__v')
            .populate(populationOption)
            .exec((err, result) => {
              if (err) {
                reject(responseService.createFailContent(err, ERROR.RUNTIME_EXCEPTION))
              } else {
                resolve(result)
              }
          })
        } catch (err) {
          reject(responseService.createFailContent(err, ERROR.RUNTIME_EXCEPTION))
        }
      } else {
        reject(responseService.createFailContent(undefined, ERROR.PARAMETERS_INVALID))
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
