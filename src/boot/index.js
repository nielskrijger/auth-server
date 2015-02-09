/**
 * Runs scripts on application boot.
 *
 * The boot script is called after mongoose connection has been made.
 */

var config = require('../lib/config');
var log = require('../lib/logger');
var User = require('../models/User');

module.exports = function(callback) {
    log.debug({message: 'Running boot scripts'});
    rootUser(callback);
}

function rootUser(callback) {
    User.findByEmail(config.get('root.username'), function(err, user) {
        if (err) {
            return callback(err);
        }
        if (!user) {
            log.debug({message: 'Did not find root user, creating it', username: config.get('root.username')});
            createRootUser(callback);
        } else {
            callback(null);
        }
    })
}

function createRootUser(callback) {
    User.createNew(config.get('root.username'), config.get('root.password'), function(err, user) {
        if (err) {
            return callback(err);
        }
        return callback(null);
    });
}
