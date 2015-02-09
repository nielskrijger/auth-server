/**
 * Contains the more common test methods.
 */

'use strict';

process.env.NODE_ENV = 'test'; // Set this to select the correct configuration files

var request = require('supertest');
var assert = require('chai').assert;
var uuid = require('node-uuid');
var Client = require('../models/Client');
var User = require('../models/User');
var config = require('../lib/config');
var server = require('../app');

/**
 * Initializes database connection, runs boot scripts, generates a random client and returns an access token to that
 * client (using `client_credentials` grant).
 */
module.exports.init = function(callback) {
    server(function(err, app) {
        if (err) {
            return callback(err);
        }
        this.createRandomClient(function(err, client) {
            if (err) {
                return callback(err);
            }
            this.getAccessToken(app, client._id, client.secret, function(err, accessToken) {
                if (err) {
                    return callback(err);
                }
                return callback(null, app, client, accessToken);
            });
        }.bind(this));
    }.bind(this));
};

module.exports.getAccessToken = function(app, clientId, clientSecret, callback) {
    request(app)
        .post('/oauth/token')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({ grant_type: 'client_credentials' })
        .set('Authorization', 'Basic ' + new Buffer(clientId + ':' + clientSecret).toString('base64'))
        .expect(200)
        .end(function(err, res) {
            if (err) {
                return callback(err);
            }
            assert.match(res.body.access_token, /[a-z0-9]+/i);
            assert.match(res.body.refresh_token, /[a-z0-9]+/i);
            assert.equal(res.body.token_type, 'bearer');
            callback(null, res.body.access_token);
        });
};

module.exports.createRandomClient = function(done) {
    User.findByEmail(config.get('root.username'), function(err, user) {
        if (err) {
            return done(err);
        }
        var id = uuid.v4();
        var secret = uuid.v4();
        var redirectUri = uuid.v4();
        this.createClient(id, secret, redirectUri, user._id, done);
    }.bind(this));
};

module.exports.createClient = function(id, secret, redirectUri, userId, done) {
    Client.createNew(id, secret, redirectUri, userId, function(err, client) {
        assert.equal(err, null, 'Unexpected error');
        assert.equal(client._id, id);
        assert.equal(client.secret, secret);
        assert.equal(client.redirectUri, redirectUri);
        done(err, client);
    });
};
