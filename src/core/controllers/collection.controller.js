const pubSubService = require('../services/connection/pubSubService')();
const collectionRepo = require('../repositories/collection.repository')();
const responseService = require('../services/response.service')();

module.exports = {
    getCollectionAction: getCollectionAction,
    updateCollectAction: updateCollectAction,
    createCollectItemAction: createCollectItemAction,
    updateCollectItemAction: updateCollectItemAction,
	removeCollectionItemAction: removeCollectionItemAction
};

function getCollectionAction(req, res) {
    collectionRepo.getCollection(req.params.schema, req.params.relations === undefined ? '' : req.params.relations, req.query.createdAt)
        .then(collection => res.status(200).json(collection))
        .catch(error => {
            res.status(400).json(responseService.createFail('error', error.message));
        });
}

function updateCollectAction(req, res) {
    collectionRepo.update(req.params.schema, req.body)
        .then(collection => { 
            res.status(200).json(collection);
            pubSubService.notifyUpdateCollection(req.params.schema, collection);
        })
        .catch(error => { 
			res.status(400).json(responseService.createFail('error', error));
        });
}

function createCollectItemAction(req, res) {
    collectionRepo.addItem(req.params.schema, req.body)
		.then(collection => {
			res.status(200).json(collection);
            // socketService.notifyAddItemCollection(req.params.schema, collection);
		})
        .catch(error => { 
            res.status(400).json(responseService.createFail('error', error));
        });
}

function updateCollectItemAction(req, res) {
    collectionRepo.updateItem(req.params.schema, req.params.id, req.body)
        .then(result => {
            res.status(200).json(result);
            pubSubService.notifyUpdateCollectionItem(req.params.schema, result);
        })
        .catch(error => {
            res.status(400).json(responseService.createFail('error', error));
        });
}

function removeCollectionItemAction(req, res) {
    collectionRepo.removeItem(req.params.schema, req.params.id)
        .then(collection => {
            res.status(200).json(collection);
            pubSubService.notifyRemoveItem(req.params.schema, collection);
        })
        .catch(error => { 
            res.status(400).json(responseService.createFail('error', error));
        });
}
