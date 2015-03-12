'use strict';

var request = require('supertest');
var assert = require('chai').assert;
var helpers = require('./helpers');

describe('Create access token', function () {

    var client;
    var app;

    before(function(done) {
        helpers.init(function(err, app, client) {
            this.app = app;
            this.client = client;
            done();
        }.bind(this));
    });

    it('should be allowed with valid client credentials', function(done) {
        request(this.app)
            .post('/oauth/token')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send({ grant_type: 'client_credentials' })
            .set('Authorization', 'Basic ' + new Buffer(this.client._id + ':' + this.client.secret).toString('base64'))
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                assert.match(res.body.access_token, /[a-z0-9]+/i);
                assert.match(res.body.refresh_token, /[a-z0-9]+/i);
                assert.equal(res.body.token_type, 'bearer');
                done();
            });
    });

    it('should not be allowed with invalid client credentials', function (done) {
        request(this.app)
            .post('/oauth/token')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send({ grant_type: 'client_credentials' })
            .set('Authorization', 'Basic dGhvbTpuaWdodHdvcmxk')
            .expect(400, /client credentials are invalid/i, done);
    });
});
