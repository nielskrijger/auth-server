'use strict';

var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');
var oauthserver = require('node-oauth2-server');
var i18n = require('i18n');
var Douane = require('douane');
var user = require('./api/user');
var log = require('./lib/logger');
var config = require('./lib/config');
var UnknownError = require('./lib/RestErrors').UnknownError;
var ValidationError = require('./lib/RestErrors').ValidationError;
var boot = require('./boot');

// Database, validation and i18n configuration
if (config.get('mongodb.debug')) {
    mongoose.set('debug', function (collectionName, method, query, doc, options) {
        log.debug({collectionName: collectionName, method: method, query: query });
    });
}
i18n.configure({
    locales: config.get('i18n.locales'),
    defaultLocale: config.get('i18n.default_locale'),
    updateFiles: config.get('i18n.update_files'),
    directory: __dirname + '/locales',
    objectNotation: true
});
var douane = new Douane({
    errorMessages: {
        required: 'validation.required',
        isEmail: 'validation.email',
        minLength: 'validation.minlength',
        maxLength: 'validation.maxlength',
        notEmpty: 'validation.notempty'
    },
    errorFormatter: function (ctx, msg, args) {
        var argsObj = {};
        for (var i = 0, max = args.length; i < max; i++) {
            argsObj[i] = args[i];
        }
        msg = ctx.req.res.__(msg, argsObj);
        return {
            param: ctx.param,
            msg: msg,
            value: ctx.value
        };
    }
});

// Log startup information
log.info('Server run mode: ' + config.get('env'));
log.info('Server port: ' + config.get('port'));
log.info('Server pid: ' + process.pid);
log.info('Server process title: ' + process.title);
log.info('Server node.js version: ' + process.version);
log.info('Server architecture: ' + process.platform);

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(i18n.init); // Use 'accept-language' header to guess language settings
app.use(douane.middleware());
app.use(function(req, res, next) {
    req.validateOrNext = validateOrNextFunction(req, next);
    next();
});

/**
 * Validates the request object and runs next(err) if any validation error occurred.
 * When request is succesfull invokes a callback.
 */
function validateOrNextFunction(req, next) {
    return function(done) {
        req.validate(function(err, result) {
            if (err) {
                next(err);
            } else if (result) {
                next(new ValidationError(result));
            } else {
                done();
            }
        });
    };
}


// Configure endpoints
app.oauth = oauthserver({
    model: require('./models/OAuth2Server'),
    grants: config.get('oauth.allowed_grants'),
    refreshTokenLifetime: config.get('oauth.refresh_token_lifetime'),
    accessTokenLifetime: config.get('oauth.access_token_lifetime'),
    debug: function(msg) {
        log.debug(msg);
    }
});
app.all('/oauth/token', app.oauth.grant());
app.get('/', app.oauth.authorise(), function(req, res) {
    res.send('Secret area');
});
app.post('/user', app.oauth.authorise(), user.postUser);

// Error handling middleware
app.use(app.oauth.errorHandler());
app.use(logErrors);
app.use(errorHandler);

function logErrors(err, req, res, next) {
    if (!err.status) {
        err = new UnknownError(err);
    }
    if (err.status && err.status < 500) {
        log.info(err);
        next(err);
    } else if (err.status && err.status >= 500) {
        log.error(err);
        next(err);
    }
}

function errorHandler(err, req, res, next) {
    res.status(err.status);
    res.json(err);
}

process.on('uncaughtException', function(err) {
    log.error({
        message: 'Uncaught exception occurred',
        error: err.message,
        fileName: err.fileName,
        lineNumber: err.lineNumber
    });
    process.exit(1); // Best practice to kill process on uncaught exception (use forever or something similar to reboot)
});

// Run boot scripts on each application start
function init(callback) {
    var bootApp = function(callback) {
        boot(function(err) {
            if (err) {
                log.error({ message: 'Error occurred during application boot', error: err });
                return callback(err);
            }
            return callback(err, app);
        });
    };

    // Create mongoose connection only when connection is disconnect (0)
    if (mongoose.connection.readyState === 0) {
        mongoose.connect(config.get('mongodb.uri'), function(err, res) {
            if (err) {
                log.error({ message: 'Failed to create mongoose connection', error: err });
                return callback(err);
            }
            log.info('Successfully connected to mongodb');
            bootApp(callback);
        });
    } else {
        bootApp(callback);
    }
}

module.exports = init;

// Normally the application server is started automatically except when require'd (might be useful for tests)
if (config.get('auto_start')) {
    log.debug({message: 'Starting environment automatically' });
    init(function(err, app) {
        app.listen(config.get('port'));
    });
}
