const responseService = require('../services/response.service')();
const deviceRepo = require('../repositories/device.repository')();

module.exports = {
    getDevicesAction: getDevicesAction,
    checkInAction: checkInAction
};

function getDevicesAction(req, res) {
    deviceRepo.getCollection()
        .then(collection => res.status(200).json(collection))
        .catch(error => {
            res.status(400).json(responseService.createFail('error', error.message));
        });
}

function checkInAction(req, res) {
	res.status(200).json({ name: "KarPos.Server", success: true });
}
