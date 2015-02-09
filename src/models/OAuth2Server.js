/**
 * Sets up the model required for node-oauth2-server by including relevant methods various mongoose models.
 */
'use strict';

var UserModel = require('./User');
var ClientModel = require('./Client');
var AccessTokenModel = require('./AccessToken');
var RefreshTokenModel = require('./RefreshToken');

function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

var oauth2model = {
    getUser: UserModel.findIdByLogin,
    getUserFromClient: ClientModel.findUserFromClient,
    getClient: ClientModel.findByLogin,
    getRefreshToken: RefreshTokenModel.getRefreshToken,
    getAccessToken: AccessTokenModel.getAccessToken,
    saveAccessToken: AccessTokenModel.saveAccessToken,
    saveRefreshToken: RefreshTokenModel.saveRefreshToken,
    grantTypeAllowed: function(clientId, grantType, callback) {
        // Allow everything
        callback(null, true);
    }
};

module.exports = oauth2model;
