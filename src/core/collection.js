class Collection {
  constructor(collectionName, preDefinition) {
    this.collectionName = collectionName
    this.preDefinition = preDefinition
  }

  convertToSchema(callback) {
    this.collectionSchema = callback(this.preDefinition)
  }

  notify(channel, options) {}

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
