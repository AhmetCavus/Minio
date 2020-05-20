const responseService = require('../services/response.service')();
const receiptRepo = require('../repositories/receipt.repository')();
const multer = require('multer');
let currentFileName;

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads/images');
    },
    filename: (req, file, cb) => {
        currentFileName = file.fieldname + '-' + Date.now() + '.png';
        cb(null, currentFileName);
    }
  });

const upload = multer({ storage: storage });

module.exports = {
    getReceiptsAction: getReceiptsAction,
    createReceiptAction: createReceiptAction
};

function getReceiptsAction(req, res) {
    deviceRepo.getCollection()
        .then(collection => res.status(200).json(collection))
        .catch(error => {
            res.status(400).json(responseService.createFail('error', error.message));
        });
}

function createReceiptAction(req, res) {
    upload.array("receiptImage")(req, res, error => {
        console.log(req.files);
        var json = JSON.parse(req.body.json);
        console.log(json);
        if (error) {
            console.log(error);
            res.status(400).json(responseService.createFail('error', error.message));
        } else {
            res.status(200).json(responseService.createSuccess('receipt', json));
        }
    });
}
