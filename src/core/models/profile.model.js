const Collection = require("../collection")
const Provider = require("../type/provider")

const ProfileModel = new Collection("Profile", {
  name: Provider.String,
  email: Provider.String,
  password: Provider.String,
  role: Provider.String,
})

module.exports = ProfileModel
