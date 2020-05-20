const basicAuth = require('express-basic-auth');
const tokenService = require('../services/token.service')();
const responseService = require('../services/response.service')();
const authRepo = require('../repositories/auth.repository')();

module.exports = {
    authenticateAction: authenticateAction,
    createAction: createAction,
    init: init
};

function init(app) {
    app.use(basicAuth({
        authorizer: checkAuthAction,
        authorizeAsync: true,
        unauthorizedResponse: getUnauthorizedResponse
    }));
}

function checkAuthAction(username, password, cb) {
    authRepo.findAdmin({ clientId: username, secretId: password })
        .then(result => cb(null, true))
        .catch(err => cb(null, false));
}

function authenticateAction(req, res) {
    authRepo.findClient(req.body)
        .then(result => onAuthSuccess(result, res))
        .catch(err => onAuthFail(err, res));
}

function createAction(req, res) {
    authRepo.findAdmin(req.body)
        .then(result => onCreateSuccess(result, res))
        .catch(err => onCreateFail(err, res));
}

function onAuthSuccess(profile, res) {
    res.status(200).json(createSuccessResponse(profile));
}

function onAuthFail(error, res) {
    res.status(400).json(createFailResponse(error));
}

function onCreateSuccess(profile, res) {
    res.status(200).json(createSuccessResponse(profile));
}

function onCreateFail(error) {
    res.status(400).json(createFailResponse(error));
}

function createSuccessResponse(profile) {
    var token = tokenService.signToken(JSON.stringify(profile));
    var result = undefined;
    if(token) result = responseService.createSuccess('token', token);
    else result = responseService.createFail('error', 'Token creation failed');
    return result;
}

function createFailResponse(error) {
    return responseService.createFail('error', error);
}

function getUnauthorizedResponse(req) {
    return req.auth ?
        createFailResponse('Credentials with ' + req.auth.user + ' rejected') :
        createFailResponse('No credentials provided');
}
