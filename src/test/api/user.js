'use strict';

var request = require('supertest');
var assert = require('chai').assert;
var uuid = require('node-uuid');
var async  = require('async');
var helpers = require('../helpers');

// An array of validation tests
var testCases = [{
    param: 'password',
    value: new Array(6).join('a'),
    msg: 'Should contain at least 6 characters'
}, {
    param: 'password',
    value: new Array(130).join('a'),
    msg: 'Should contain no more than 128 characters'
}, {
    param: 'email',
    value: 'invalid@email',
    msg: 'Must be a valid email'
}];

describe('POST /user', function () {

    var client;
    var app;
    var accessToken;
    var userRequest;

    before(function(done) {
        helpers.init(function(err, app, client, accessToken) {
            this.app = app;
            this.client = client;
            this.accessToken = accessToken;
            done();
        }.bind(this));
    });

    beforeEach(function() {
        this.userRequest = {
            email: uuid.v4() + '@localhost.tst',
            password: uuid.v4()
        };
    });

    it('should successfully create a new user', function (done) {
        helpers.createUser(this.app, this.userRequest, this.accessToken)
            .expect(function(res) {
                assert.match(res.body.id, /[a-z0-9]+/i);
                assert.match(res.body.created, /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+Z/);
                assert.equal(res.body.emails[0].email, this.userRequest.email);
                assert.equal(res.body.emails[0].verified, false);
                assert.match(res.body.emails[0].created, /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+Z/);
                return false;
            }.bind(this))
            .expect(201, done);
    });

    it('should not allow duplicate email address', function (done) {
        helpers.createUser(this.app, this.userRequest, this.accessToken).end(function(err, res) {
            assert(!err);
            helpers.createUser(this.app, this.userRequest, this.accessToken).expect(function(res) {
                assert.deepEqual(res.body.error_details[0], {
                    param: 'email',
                    msg: 'Email already in use',
                    value: this.userRequest.email
                });
            }.bind(this))
            .expect(400, done);
        }.bind(this));
    });

    async.each(testCases, function(testCase, callback) {
        it(testCase.param + ' ' + testCase.msg.toLowerCase(), function(done) {
            this.userRequest[testCase.param] = testCase.value;
            helpers.createUser(this.app, this.userRequest, this.accessToken)
                .expect(function(res) {
                    assert.deepEqual(res.body.error_details[0], {
                        param: testCase.param,
                        msg: testCase.msg,
                        value: testCase.value
                    });
                })
                .expect(400, done);
        });
    });
});
