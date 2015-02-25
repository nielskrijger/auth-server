'use strict';

var i18n = require('i18n');
var log = require('../lib/logger');
var config = require('../lib/config');
var User = require('../models/User');
var Douane = require('douane');

module.exports.postUser = function(req, res, next) {
    var min = config.get('password.minlength');
    var max = config.get('password.maxlength');
    if (min) {
        req.checkBody('password').minLength(min);
    }
    if (max) {
        req.checkBody('password').maxLength(max);
    }
    req.checkBody('email').required().isEmail();
    req.checkBody('roles').optional().isArray();
    req.validateOrNext(function() {
        // TODO add validation option ?validate
        User.createNew(req.body, function(err, newUser) {
            if (err) {
                return next(err);
            }
            res.setHeader('Location', '/users/' + newUser._id);
            res.status(201).json(userRepresentation(newUser));
        });
    });
};

function findResources(req, res, next) {

}

function userRepresentation(user) {
    return {
        id: user._id,
        emails: user.emails
    };
}
