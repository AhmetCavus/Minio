const pubSubService = require('../services/pubsub.service')

module.exports = {
    createChannelAction: createChannelAction,
    getChannelsAction: getChannelsAction,
	sendBroadcastAction: sendBroadcastAction,
};

function createChannelAction(req, res) {
    var result = pubSubService.createChannel(req.params.channelId);
    if(result.success) {
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }
}

function getChannelsAction(res, res) {
    res.status(200).json([])
}

function sendBroadcastAction(req, res) {
    pubSubService.sendBroadcast(req.body, req.params.id);
    res.status(200).json({ success: true });
}