'use strict';

var request = require('supertest');
var assert = require('chai').assert;
var helpers = require('../helpers');
var ClientModel = require('../../models/Client');

describe('Client model', function () {

    var client;
    var app;

    before(function(done) {
        helpers.init(function(err, app, client) {
            this.app = app;
            this.client = client;
            done();
        }.bind(this));
    });

    describe('find by login', function () {
        it('should find client using client id and secret', function (done) {
            ClientModel.findByLogin(this.client._id, this.client.secret, function(err, result) {
                assert.equal(err, null, 'Unexpected error');
                assert.equal(result._id, this.client._id);
                assert.equal(result.secret, this.client.secret);
                assert.equal(result.redirectUri, this.client.redirectUri);
                assert.equal(result.userId, this.client.userId);
                done();
            }.bind(this));
        });
    });
});
