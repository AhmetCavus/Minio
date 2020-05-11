const Collection = require("./../../src/core/collection")
const Provider = require("./../../src/core/type/provider")

const AdminModel = new Collection("Admin", {
  name: Provider.String,
  role: Provider.String,
  email: Provider.String,
  password: Provider.String,
})

module.exports = AdminModel
