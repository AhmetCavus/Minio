const ERROR = {
  RUNTIME_EXCEPTION: {
    name: "RUNTIME_EXCEPTION",
    message: "Runtime exception",
    code: 1000
  },
  NO_USERS_FOUND: {
    name: "NO_USERS_FOUND",
    message: "",
    code: 1001,
  },
  NO_SOCKETS_FOUND: {
    name: "NO_SOCKETS_FOUND",
    message: "",
    code: 1002,
  },
  CREATE_FAILED: {
    name: "CREATE_FAILED",
    message: "Create operation has failed",
    code: 1003,
  },
  ID_NOT_MATCHED: {
    name: "ID_NOT_MATCHED",
    message: "Id not matched with the items in collection",
    code: 1004,
  },
  PARAMETERS_INVALID: {
    name: "PARAMETERS_INVALID",
    message: "Parameters are invalid",
    code: 1005,
  },

  // DB Errors
  DB_DUPLICATE_KEY_ERROR: 11000
}

module.exports = ERROR
