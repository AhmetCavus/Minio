const Collection = require("./../../../src/core/collection")
const Provider = require("./../../../src/core/type/provider")

const categoryModel = new Collection("Profile", {
  name: { type: Provider.String, required: true, unique: true },
  description: Provider.String,
  image: Provider.String,
  stats: {
    count: Provider.Number,
    isFood: Provider.Boolean,
  },
})

module.exports = categoryModel
