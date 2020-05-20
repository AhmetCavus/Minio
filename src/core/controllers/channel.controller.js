const pubSubService = require('../services/connection/pubSubService')();

module.exports = {
    createChannelAction: createChannelAction,
	sendBroadcastAction: sendBroadcastAction,
    onSendBroadCast: onSendBroadCast,
    onSendPrivateMessage: onSendPrivateMessage,
    onUpdate: onUpdate,
    onCollectionAddItem: onCollectionAddItem,
    onCollectionRemoveItem: onCollectionRemoveItem,
    onRequestCollection: onRequestCollection,
	onRequestAiData: onRequestAiData
};

function createChannelAction(req, res) {
    var result = pubSubService.createChannel(req.params.id);
    if(result.success) {
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }
}

function sendBroadcastAction(req, res) {
    pubSubService.sendBroadcast(req.body, req.params.id);
    res.status(200).json({ success: true });
}

// #region Socket Event Handlers

function onSendBroadCast(data, channel, socket) {
    channelRepo.broadcast(data, channel, socket);
}

function onSendPrivateMessage(data, channel, socket) {
    channelRepo.sendPrivateMessage(data, channel, socket);
}

function onUpdate(data, channel, socket) {
    channelRepo.update(data, channel, socket);
}

function onCollectionAddItem(data, channel, socket) {
    channelRepo.addItem(data, channel, socket);
}

function onCollectionRemoveItem(data, channel, socket) {
    channelRepo.removeItem(data, channel, socket);
}

function onRequestCollection(data, socket) {
    channelRepo.requestCollection(data, socket);
}

function onRequestAiData(data, socket) {
    channelRepo.requestAiData(data, socket);
}
