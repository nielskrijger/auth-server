'use strict';

var winston = require('winston');
require('winston-loggly');
var os = require('os');
var _ = require('lodash');
var config = require('./config');

var transports = [];

// Configure log stream to stdout.
if (config.get('log.stdout.level') != 'none') {
    transports.push(
        new (winston.transports.Console)({
            level: config.get('log.stdout.level'),
            prettyPrint: true,
            colorize: true,
        })
    );
}

// Configure log stream to loggly.
if (config.get('log.loggly.level') != 'none') {
    var tags = config.get('log.loggly.tags');
    transports.push(
        new winston.transports.Loggly({
            level: config.get('log.loggly.level'),
            token: config.get('log.loggly.token'),
            subdomain: config.get('log.loggly.subdomain'),
            tags: (tags instanceof Array) ? tags : tags.split(','),
            json: true
        })
    );
}

// Instantiates the Winston logger.
var log = new (winston.Logger)({
    transports: transports
});

log.on('error', function(err) {
    console.log('Error occurred while processing a log message: ' + err);
});

module.exports = log;
