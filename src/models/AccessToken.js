'use strict';

var mongoose = require('mongoose');
var log = require('../lib/logger');
var Schema = mongoose.Schema;

var AccessTokenSchema = new Schema({
    _id: { type: String, required: true },
    clientId: { type: String, required: true },
    userId: { type: String, required: true },
    expires: { type: Date }
});

AccessTokenSchema.statics.saveAccessToken = function (token, clientId, expires, userId, callback) {
    log.debug({message: 'Saving access token', token: token, clientId: clientId, userId: userId });
    var accessToken = new AccessTokenModel({
        _id: token,
        clientId: clientId,
        userId: userId,
        expires: expires
    });
    accessToken.save(callback);
};

AccessTokenSchema.statics.getAccessToken = function (bearerToken, callback) {
    log.debug({message: 'Retrieve bearer access token', bearerToken: bearerToken });
    AccessTokenModel.findOne({
        _id: bearerToken
    }, callback);
};

var AccessTokenModel = mongoose.model('access_tokens', AccessTokenSchema);

module.exports = AccessTokenModel;
