class ResponseService {

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

  createFailContent(err, fallback) {
    return {
      name: err?.name || fallback.name,
      code: err?.code || fallback.code,
      message: err?.message || fallback.message,
    }
  }

}


module.exports = new ResponseService()
