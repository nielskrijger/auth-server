'use strict';

var mongoose = require('mongoose');
var log = require('../lib/logger');
var Schema = mongoose.Schema;

var ClientSchema = new Schema({
    _id: { type: String, required: true },
    secret: { type: String, required: true },
    redirectUri: { type: String, required: true },
    userId: { type: String, required: true }
});

ClientSchema.statics.createNew = function(id, secret, redirectUri, userId, callback) {
    log.debug({message: 'Creating new client', clientId: id, redirectUri: redirectUri, userId: userId });
    ClientModel.create({
        _id: id,
        secret: secret,
        redirectUri: redirectUri,
        userId: userId
    }, callback);
};

ClientSchema.statics.findUserFromClient = function(id, secret, callback) {
    ClientModel.findByLogin(id, secret, function(err, client) {
        if (err) {
            return callback(err);
        }
        if (client) {
            log.debug({message: 'Found user who owns client credentials', clientId: id, userId: client.userId });
        } else {
            log.debug({message: 'Did not find client using client credentials', clientId: id });
        }
        return callback(null, client.userId);
    });
};

ClientSchema.statics.findByLogin = function(id, secret, callback) {
    log.debug({message: 'Requesting Client login', clientId: id });
    ClientModel.findOne({
        _id: id,
        secret: secret
    }, callback);
};

var ClientModel = mongoose.model('clients', ClientSchema);

module.exports = ClientModel;
