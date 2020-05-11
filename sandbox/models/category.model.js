const Collection = require("./../../src/core/collection")
const Provider = require("./../../src/core/type/provider")

const CategoryModel = new Collection("Category", {
  name: Provider.String,
  description: Provider.String,
  image: Provider.String,
})

module.exports = CategoryModel
