'use strict';

var Douane = require('douane');
var moment = require('moment');
var log = require('../lib/logger');
var config = require('../lib/config');
var User = require('../models/User');

module.exports.postUser = function(req, res, next) {
    var min = config.get('password.minlength');
    var max = config.get('password.maxlength');
    if (min) {
        req.checkBody('password').minLength(min);
    }
    if (max) {
        req.checkBody('password').maxLength(max);
    }
    req.checkBody('email').required().isEmail().isUniqueEmail();
    req.checkBody('roles').optional().isArray();

    req.validateOrQuit(function() {
        User.createNew(req.body, function(err, newUser) {
            if (err) {
                return next(err);
            }
            res.setHeader('Location', '/users/' + newUser._id);
            res.status(201).json(userRepresentation(newUser));
        });
    });
};

Douane.setAsyncValidator('isUniqueEmail', 'validation.uniqueEmail', function(context, done) {
    User.findByEmail(context.value, function(err, user) {
        if (err) {
            return done(err);
        }
        return done(null, user === null);
    });
});

function userRepresentation(user) {
    return {
        id: user._id,
        emails: user.emails,
        created: user.created,
        modified: user.modified
    };
}
