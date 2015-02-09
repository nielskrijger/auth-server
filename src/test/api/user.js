'use strict';

var request = require('supertest');
var assert = require('chai').assert;
var uuid = require('node-uuid');
var testUtils = require('../testUtils');

describe('POST /user', function () {

    var client;
    var app;
    var accessToken;
    var email;
    var password;

    before(function(done) {
        email = uuid.v4() + '@localhost.tst';
        password = uuid.v4();
        testUtils.init(function(err, app, client, accessToken) {
            this.app = app;
            this.client = client;
            this.accessToken = accessToken;
            done();
        }.bind(this));
    });

    it('should successfully create a new user', function (done) {
        request(this.app)
            .post('/user')
            .send({email: this.email, password: this.password})
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + this.accessToken)
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
});
