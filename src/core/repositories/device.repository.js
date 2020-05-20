const keystone = require('keystone');
Device = keystone.list('Device');

class DeviceRepository {

    constructor() {

    }

    getCollection() {
        return new Promise((resolve, reject) => {
            try {
                Device.model
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

}

var deviceRepo;
module.exports = () => {
    if(!deviceRepo) deviceRepo = new DeviceRepository();
    return deviceRepo;
}
