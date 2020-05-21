class ResponseService {
  constructor() {
    console.log("ResponseService created")
  }

  createSuccess(successKey, successValue) {
    var res = {}
    if (!successValue) {
      successValue = successKey
      successKey = "message"
    }
    res[successKey] = successValue
    res.success = true
    return res
  }

  createFail(errorKey, errorValue) {
    var res = {}
    if (!errorValue) {
      errorValue = errorKey
      errorKey = "error"
    }
    res[errorKey] = errorValue
    res.success = false
    return res
  }
}

module.exports = new ResponseService()
