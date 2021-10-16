const Collection = require("../collection")
const Provider = require("../type/provider")

const ProfileModel = new Collection("Profile", {
  name: { type: Provider.String, required: true },
  email: { type: Provider.String, required: true },
  password: Provider.String,
  role: Provider.String,
  isOnline: Provider.Boolean,
  connectedSince: Provider.Date,
})

module.exports = ProfileModel
