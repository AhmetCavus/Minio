const basicAuth = require('express-basic-auth');
const socketioJwt = require('socketio-jwt');
const tokenService = require('../services/token.service')();
const responseService = require('../services/response.service')();

module.exports = {
    handleXhrAction: handleXhrAction
};

function handleXhrAction(req, res) {
    console.log(req);
    res.json(req.query.transport);
}