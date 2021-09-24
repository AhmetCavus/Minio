const pubSubService = require("../services/pubsub.service")
const collectionRepo = require("../repositories/collection.repository")
const responseService = require("../services/response.service")

exports.getCollection = (req, res) => {
  collectionRepo
    .getCollection(
      req.params.schema,
      req.params.relations === undefined ? "" : req.params.relations,
      req.query.isJson,
      req.query.createdAt
    )
    .then(collection => res.status(200).json(collection))
    .catch(error => {
      res.status(400).json(responseService.createFail("error", error.message))
    })
}

exports.updateCollection = (req, res) => {
  collectionRepo
    .update(req.params.schema, req.body)
    .then(collection => {
      res.status(200).json(collection)
      pubSubService.notifyUpdateCollection(req.params.schema, collection)
    })
    .catch(error => {
      res.status(400).json(responseService.createFail("error", error))
    })
}

exports.addCollectionItem = (req, res) => {
  collectionRepo
    .addItem(req.params.schema, req.body)
    .then(item => {
      res.status(200).json(item)
      pubSubService.notifyAddCollectionItem(req.params.schema, item)
    })
    .catch(error => {
      res.status(400).json(responseService.createFail("error", error))
    })
}

exports.updateCollectItem = (req, res) => {
  collectionRepo
    .updateItem(req.params.schema, req.params.id, req.body)
    .then(result => {
      res.status(200).json(result)
      pubSubService.notifyUpdateCollectionItem(req.params.schema, result)
    })
    .catch(error => {
      res.status(400).json(responseService.createFail("error", error))
    })
}

exports.removeCollectionItem = (req, res) => {
  collectionRepo
    .removeItem(req.params.schema, req.params.id)
    .then(item => {
      res.status(200).json(item)
      pubSubService.notifyRemoveItem(req.params.schema, item)
    })
    .catch(error => {
      res.status(400).json(responseService.createFail("error", error))
    })
}
