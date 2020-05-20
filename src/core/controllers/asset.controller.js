const responseService = require('../services/response.service')();
const assetRepo = require('../repositories/asset.repository')();
const multer = require('multer');
let currentFileName;

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
		assetRepo.prepareForSending(req, file, cb);
    },
    filename: (req, file, cb) => {
		assetRepo.send(req, file, cb);
    }
  });

const upload = multer({ storage: storage });

module.exports = {
	getAssetsAction: getAssetsAction,
	createAssetAction: createAssetAction,
	removeAssetAction: removeAssetAction
};

function getAssetsAction(req, res) {
	assetRepo.readDirectory(req)
	.then(assets => { 
		res.status(200).json(responseService.createSuccess('data', assets));
	})
	.catch(error => { 
		res.status(400).json(responseService.createFail('error', error));
	});
}

function createAssetAction(req, res) {
    upload.array("uploadAssets")(req, res, error => {
		console.log(req.files);
		if(req.body.json) {
			var json = JSON.parse(req.body.json);
			console.log(json);
		}
        if (error) {
            console.log(error);
            res.status(400).json(responseService.createFail('error', error.message));
        } else {
            res.status(200).json(responseService.createSuccess('data', req.files[0]));
        }
    });
}

function removeAssetAction(req, res) {
    assetRepo.removeAsset(req)
	.then(assets => { 
		res.status(200).json(responseService.createSuccess('data', assets));
	})
	.catch(error => { 
		res.status(400).json(responseService.createFail('error', error));
	});
}
