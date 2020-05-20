const extractPath = Symbol('extractPath');
const fs = require('fs');

class AssetRepository {

    constructor() {
		this.meta = null;
		this.currentFileName = null;
    }

	readDirectory(req) {
		return new Promise((resolve, reject) => {
			let filesDir = `./public/storage/assets/${req.params.assetType}`;
			fs.readdir(filesDir, (err, assets) => {
				if(err) {
					reject(err);
				} else {
					resolve(assets)
				}
			});
		});
	}

	removeAsset(req) {
		return new Promise((resolve, reject) => {
			let filesDir = `./public/storage/assets/${req.params.assetType}/${req.params.assetName}`;
			fs.unlink(filesDir, (err) => {
				if(err) {
					reject(err);
				} else {
					resolve();
				}
			});
		});
	}

	prepareForSending(req, file, cb) {
		this.meta = this[extractPath](file);
		this.currentFileName = req.params.assetName + '.' + this.meta.fileExtension;
		let filesDir = `./public/storage/assets/${this.meta.path}`;
		// check if directory exists
		if (!fs.existsSync(filesDir)) {
			// if not create directory
			fs.mkdirSync(filesDir);
		}
        cb(null, filesDir);
	}

    send(req, file, cb) {
        return new Promise((resolve, reject) => {
            try {
				cb(null, this.currentFileName);
			} catch (err) { 
				reject(err);
			}
		});
	}
	
	[extractPath](file) {
		let meta = {};
		if(file.mimetype == 'image/bmp') {
			meta.path = 'images';
			meta.fileExtension = 'bmp';
		} else if(file.mimetype == 'image/gif') {
			meta.path = 'images';
			meta.fileExtension = 'gif';
		} else if(file.mimetype == 'image/jpeg') {
			meta.path = 'images';
			meta.fileExtension = 'jpeg';
		} else if(file.mimetype == 'image/png') {
			meta.path = 'images';
			meta.fileExtension = 'png';
		} else if(file.mimetype == 'application/pdf') {
			meta.path = 'documents';
			meta.fileExtension = 'pdf';
		} else {
			meta.path = 'documents';
			meta.fileExtension = 'dat';
		}
		return meta;
	}
}

var assetRepo;
module.exports = () => {
    if(!assetRepo) assetRepo = new AssetRepository();
    return assetRepo;
}
