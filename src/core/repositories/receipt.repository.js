const keystone = require('keystone');
Receipt = keystone.list('Receipt');

class ReceiptRepository {

    constructor() {

    }

    getCollection() {
        return new Promise((resolve, reject) => {
            try {
                Receipt.model
                    .find()
                    .select()
                    .exec((err, items) => {
                        if(err) {
                            reject(err);
                        } else {
                            resolve(items);
                        }
                    });
                } catch (err) { 
                    reject(err);
                }
            });
    }

    createItem(content) {
        return new Promise((resolve, reject) => {
            if (content) {
                try {
					if (typeof content.json === 'string' || content.json instanceof String) {
						content = JSON.parse(content.json);
					}
					if(content._id !== undefined) delete content._id;
                    var newItem = new Receipt.model(content);
                    newItem.save(err => {
                        if (err) {
                            var res = { success: false, message: err, key: SOCKET.COMMAND_COLLECTION_ADD_ITEM };
                            reject(res);
                        } else {
                            resolve(content);
                        }
                    });
                } catch (e) {
                    var res = { success: false, message: e };
                    reject(res);
                }
            } else {
                var res = { success: false, message: ERROR.PARAMETERS_INVALID, key: SOCKET.COMMAND_COLLECTION_ADD_ITEM };
                reject(res);
            }
        });
    }

}

var receiptRepo;
module.exports = () => {
    if(!receiptRepo) receiptRepo = new ReceiptRepository();
    return receiptRepo;
}
