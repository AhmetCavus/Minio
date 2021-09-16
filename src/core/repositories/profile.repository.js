const bcrypt = require("bcryptjs")

const Profile = require("../models/profile.model")

class ProfileRepository {
  constructor() {}

  isInitialized() {
    return new Promise((resolve, reject) => {
      Profile.model
        .findOne()
        .then(profile => {
          resolve(profile ? true : false)
        })
        .catch(err => reject(err))
    })
  }

  find(email) {
    return new Promise((resolve, reject) => {
      Profile.model
        .findOne({ email: email })
        .then(profile => {
          resolve(profile)
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  create(newProfile) {
    const { name, password, email, role } = newProfile
    return new Promise((resolve, reject) => {
      const saltRounds = 11
      bcrypt
        .hash(password, saltRounds)
        .then(hashPass => {
          return Profile.model.create({
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
          reject(err)
        })
    })
  }
}

module.exports = new ProfileRepository()
