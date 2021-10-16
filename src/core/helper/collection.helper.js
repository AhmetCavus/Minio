const _ = require("lodash")

class CollectionHelper {

    static resolveSubSchemasFromBody(body) {
        const Minio = require("./../minio.app")
        const existingSchemas = Minio.Instance.schemas()
        const itemsToAdd = _.intersection(existingSchemas.map(s => s.toLowerCase()), Object.keys(body).filter(k => _.isObject(body[k])).map(k => k.toLowerCase()))
        return itemsToAdd
    }
}

module.exports = CollectionHelper