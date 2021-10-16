const Collection = require("../collection")
const Provider = require("../type/provider")

const ProfileModel = new Collection("Profile", {
  username: { type: Provider.String, required: true },
  email: { type: Provider.String, required: true },
  password: { type: Provider.String, required: true },
  role: Provider.String,
  isOnline: Provider.Boolean,
  connectedSince: Provider.Date,
})

module.exports = ProfileModel
