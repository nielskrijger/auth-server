'use strict';

var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');
var oauthserver = require('node-oauth2-server');
var user = require('./api/user');
var log = require('./lib/logger');
var config = require('./lib/config.js');
var boot = require('./boot');

mongoose.set('debug', function (collectionName, method, query, doc, options) {
    log.debug('mongo collection: %s method: %s', collectionName, method);
});

// Log startup information
log.info('Server run mode: ' + config.get('env'));
log.info('Server port: ' + config.get('port'));
log.info('Server pid: ' + process.pid);
log.info('Server process title: ' + process.title);
log.info('Server node.js version: ' + process.version);
log.info('Server architecture: ' + process.platform);

var app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

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

app.use(app.oauth.errorHandler());

function init(callback) {
    var bootApp = function(callback) {
        boot(function(err) {
            if (err) {
                log.error({message: 'Failed to boot application', error: err });
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

if (config.get('auto_start')) {
    log.debug({message: 'Starting environment automatically' });
    init(function(err, app) {
        app.listen(config.get('port'));
    });
}
