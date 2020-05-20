const keystone = require("keystone")
Admin = keystone.list("Admin")
Client = keystone.list("Client")

class AuthRepository {
  constructor() {}

  findAdmin(param) {
    return new Promise((resolve, reject) => {
      Admin.model.findOne({ email: param.clientId }).exec((err, account) => {
        if (account) {
          account._.password.compare(param.secretId, (err, isMatch) => {
            if (!err && isMatch) {
              resolve(account)
            } else {
              reject(err)
            }
          })
        } else {
          reject("Invalid credentials")
        }
      })
    })
  }

  addAdmin(param) {
    return new Promise((resolve, reject) => {
      let newClient = new Admin.model({
        email: param.clientId,
        password: param.secretId,
      })

      newClient.save(err => {
        if (err) reject(err)
        else resolve(newClient)
      })
    })
  }

  findClient(param) {
    return new Promise((resolve, reject) => {
      Client.model.findOne({ email: param.clientId }).exec((err, account) => {
        if (account) {
          account._.password.compare(param.secretId, (err, isMatch) => {
            if (!err && isMatch) {
              resolve(account)
            } else {
              reject(err)
            }
          })
        } else {
          reject("Invalid credentials")
        }
      })
    })
  }

  addClient(param) {
    return new Promise((resolve, reject) => {
      let newClient = new Client.model({
        email: param.clientId,
        password: param.secretId,
      })

      newClient.save(err => {
        if (err) reject(err)
        else resolve(newClient)
      })
    })
  }
}

module.exports = AuthRepository
