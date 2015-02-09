'use strict';

var mongoose = require('mongoose');
var log = require('../lib/logger');
var Schema = mongoose.Schema;

var RefreshTokenSchema = new Schema({
    _id: { type: String, required: true },
    clientId: { type: String, required: true },
    userId: { type: String, required: true },
    expires: { type: Date }
});

RefreshTokenSchema.statics.saveRefreshToken = function (token, clientId, expires, userId, callback) {
    log.debug({message: 'Saving refresh token', token: token, clientId: clientId, userId: userId });

    var refreshToken = new RefreshTokenModel({
        _id: token,
        clientId: clientId,
        userId: userId,
        expires: expires
    });
    refreshToken.save(callback);
};

RefreshTokenSchema.statics.getRefreshToken = function (refreshToken, callback) {
    log.debug({message: 'Retrieve refresh token', refreshToken: refreshToken });

    RefreshTokenModel.findOne({
        _id: refreshToken
    }, callback);
};

var RefreshTokenModel = mongoose.model('refresh_tokens', RefreshTokenSchema);

module.exports = RefreshTokenModel;
