class Collection {
  constructor(collectionName, preDefinition) {
    this.collectionName = collectionName
    this.preDefinition = preDefinition
  }

  enableSocket() {
    this.pubSubService = require("./services/pubsub.service")
    this.pubSubService.createChannel(this.collectionName)
  }

  convertToSchema(callback) {
    this.collectionSchema = callback(this.preDefinition)
  }

  notifyAddItemCollection(item) {
    this.pubSubService.notifyAddItemCollection(this.collectionName, item)
  }

  notifyRemoveItem(item) {
    this.pubSubService.notifyRemoveItem(this.collectionName, item)
  }

  notifyUpdateCollection(items) {
    this.pubSubService.notifyUpdateCollection(this.collectionName, items)
  }

  notifyUpdateCollectionItem(item) {
    this.pubSubService.notifyUpdateCollectionItem(this.collectionName, item)
  }

  setOnDisconnectedListener(onDisconnectListener) {
    this.pubSubService.setOnDisconnectedListener(onDisconnectListener)
  }

  get name() {
    return this.collectionName
  }

  get schema() {
    return this.collectionSchema
  }

  set model(value) {
    this.collectionModel = value
  }

  get model() {
    return this.collectionModel
  }
}

module.exports = Collection
