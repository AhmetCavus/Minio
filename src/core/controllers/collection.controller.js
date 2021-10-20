const _ = require("lodash")
const pubSubService = require("../services/pubsub.service")
const collectionRepo = require("../repositories/collection.repository")
const responseService = require("../services/response.service")
const CollectionHelper = require("./../helper/collection.helper")

exports.getCollection = (req, res) => {
  collectionRepo
    .getCollection(
      req.params.schema,
      req.query.isJson,
      req.query.createdAt
    )
    .then(collection => res.status(200).json(collection))
    .catch(error => {
      res.status(400).json(responseService.createFail("error", error.message))
    })
}

exports.getPopulatedCollection = (req, res) => {
  collectionRepo
    .getPopulatedCollection(
      req.params.schema,
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
  let children = CollectionHelper.resolveSubSchemasFromBody(req.body)
  collectionRepo
    .recursiveAddItems(req.params.schema, req.body, children)
    .then(item => {
      res.status(200).json(item)
      pubSubService.notifyAddCollectionItem(req.params.schema, item)
    })
    .catch(error => {
      res.status(400).json(responseService.createFail("error", error))
    })
}

exports.updateCollectItem = (req, res) => {
  let children = CollectionHelper.resolveSubSchemasFromBody(req.body)
  collectionRepo
    .recursiveUpdateItems(req.params.schema, req.params.id, req.body, children)
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
