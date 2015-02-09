'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var uuid = require('node-uuid');
var config = require('../lib/config');
var log = require('../lib/logger');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    _id: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
});

UserSchema.statics.createNew = function(email, password, callback) {
    this.cryptPassword(password, function(err, hash) {
        if (err) {
            return callback(err);
        }
        var userId = uuid.v4();
        log.debug({message: 'Creating new user', email: email, userId: userId });
        User.create({
            _id: userId,
            email: email,
            password: hash
        }, callback);
    });
};

UserSchema.statics.findByEmail = function(email, callback) {
    User.findOne({
        email: email
    }, function(err, user) {
        if (err) {
            return callback(err);
        }
        if (user) {
            log.debug({message: 'Found user by email', email: email, userId: user._id });
        } else {
            log.debug({message: 'Did not find user by email', email: email });
        }
        callback(null, user);
    });
};

UserSchema.statics.findIdByLogin = function(email, password, callback) {
    log.debug({message: 'Find user by email and password', email: email });
    User.findOne({
        email: email
    }, function(err, user) {
        if (err) {
            return callback(err);
        }

        // Return user id only if password matches
        this.comparePassword(user.password, password, function(err, isPasswordMatch) {
            if (err) {
                return callback(err);
            }
            if (isPasswordMatch) {
                return callback(null, user._id);
            }
            return callback(null, null);
        });
    });
};

UserSchema.statics.cryptPassword = function(password, callback) {
    bcrypt.genSalt(config.get('bcrypt_cost_factor'), function(err, salt) {
        if (err) {
            return callback(err);
        }
        bcrypt.hash(password, salt, function(err, hash) {
            return callback(err, hash);
        });
    });
};

UserSchema.statics.comparePassword = function(password, userPassword, callback) {
    bcrypt.compare(password, userPassword, function(err, isPasswordMatch) {
        if (err) {
            return callback(err);
        }
        return callback(null, isPasswordMatch);
    });
};

var User = mongoose.model('users', UserSchema);

module.exports = User;
