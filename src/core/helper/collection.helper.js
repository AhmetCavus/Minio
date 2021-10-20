const { isUndefined } = require("lodash")
const _ = require("lodash")

class CollectionHelper {

    static MAX_DEPTH = 5

    static resolveSubSchemasFromBody(body) {
        const Minio = require("./../minio.app")
        const existingSchemas = Minio.Instance.schemas()
        const itemsToAdd = _.intersection(existingSchemas.map(s => s.toLowerCase()), Object.keys(body).filter(k => _.isObject(body[k])).map(k => k.toLowerCase()))
        return itemsToAdd
    }

    static resolveReferencesFromSchema(schemaName, resolveSchema, depth = 0) {
        if(depth > CollectionHelper.MAX_DEPTH) return {}
        let populations = []
        let ResolvedSchema = resolveSchema(schemaName)
        let subSchemas = Object.values(ResolvedSchema.preDefinition).filter(x => !isUndefined(x.ref) && !isUndefined(x.type))
        for(let subSchema of subSchemas) {
            let nestedPopulation = this.resolveReferencesFromSchema(subSchema.ref, resolveSchema, depth +1)
            populations.push({
                path: subSchema.ref.toLowerCase(),
                model: this.capitalizeString(subSchema.ref),
                select: '-__v',
                populate: nestedPopulation 
            })
        }
        return populations
    }
    static capitalizeString(text) { return text.charAt(0).toUpperCase() + text.slice(1) }
}

module.exports = CollectionHelper