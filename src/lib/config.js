'use strict';

var convict = require('convict');
var defaultConfig = require('../config/default');

var conf = convict(defaultConfig)
var env = conf.get('env');
conf.loadFile(__dirname + '/../config/' + env + '.json');
conf.validate();

module.exports = conf;
