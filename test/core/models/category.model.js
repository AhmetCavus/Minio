const Provider = require("./../../../src/core/type/provider")

const categoryModel = {
  name: Provider.String,
  description: Provider.String,
  image: Provider.String,
  stats: {
    count: Provider.Number,
    isFood: Provider.Boolean,
  },
}

module.exports = categoryModel
