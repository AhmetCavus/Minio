const bcrypt = require("bcrypt")

const Credential = require("./../models/credential.model")

class CredentialsRepository {
  constructor() {
    console.log("Credential repo created")
  }

  isInitialized() {
    return new Promise((resolve, reject) => {
      Credential.model
        .findOne()
        .then(credential => {
          resolve(credential ? true : false)
        })
        .catch(err => reject(err))
    })
  }

  find(email) {
    return new Promise((resolve, reject) => {
      Credential.model
        .findOne({ email: email })
        .then(client => {
          resolve(client)
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  create(newCredential) {
    const { name, password, email, role } = newCredential
    return new Promise((resolve, reject) => {
      const saltRounds = 11
      bcrypt
        .hash(password, saltRounds)
        .then(hashPass => {
          return Credential.model.create({
            name: name,
            password: hashPass,
            email: email,
            role: role,
          })
        })
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          reject(result)
        })
    })
  }
}

module.exports = new CredentialsRepository()
