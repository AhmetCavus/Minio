var ERROR = {
    NO_USERS_FOUND: {
        key: "NO_USERS_FOUND",
        message: "",
        code: 1001
    },
    NO_SOCKETS_FOUND: {
        key: "NO_SOCKETS_FOUND",
        message: "",
        code: 1002
    },
    SAVE_FAILED: {
        key: "SAVE_FAILED",
        message: "",
        code: 1003
    },
    ID_NOT_MATCHED: {
        key: "ID_NOT_MATCHED",
        message: "Id not matched with the items in collection",
        code: 1004
    },
    PARAMETERS_INVALID: {
        key: "PARAMETERS_INVALID",
        message: "Parameters are invalid",
        code: 1005
    },
}

module.exports = () => {
    return ERROR;
};