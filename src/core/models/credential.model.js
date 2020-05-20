const Collection = require("./../collection")
const Provider = require("./../type/provider")

const CredentialModel = new Collection("Credential", {
  name: Provider.String,
  email: Provider.String,
  password: Provider.String,
  role: Provider.String,
})

module.exports = CredentialModel
