class Provider {
  static get Array() {
    return require("./array")
  }

  static get Boolean() {
    return require("./boolean")
  }

  static get Buffer() {
    return require("./buffer")
  }

  static get Date() {
    return require("./date")
  }

  static get Decimal() {
    return require("./decimal")
  }

  static get Map() {
    return require("./map")
  }

  static get Mixed() {
    return require("./mixed")
  }

  static get Number() {
    return require("./number")
  }

  static get ObjectId() {
    return require("./objectId")
  }

  static get String() {
    return require("./string")
  }
}

module.exports = Provider
