'use strict';

var os = require('os');

module.exports = {
    env: {
        doc: 'The applicaton environment.',
        format: ['development', 'test', 'production'],
        default: 'development',
        env: 'NODE_ENV'
    },
    port: {
        doc: 'The port to bind to.',
        format: 'port',
        default: 3000,
        env: 'PORT'
    },
    auto_start: {
        doc: 'Automatically start the node.js application server.',
        default: true,
        env: 'AUTO_START'
    },
    mongodb: {
        uri: {
            doc: 'The mongodb connection uri.',
            format: '*',
            default: 'mongodb://localhost:27017/auth',
            env: 'MONGODB_URL'
        }
    },
    root: {
        username: {
            doc: 'Username of root user. The root user is required to create initial users and clients.',
            default: 'root',
            env: 'ROOT_USERNAME'
        },
        password: {
            doc: 'Username of root user.',
            default: 'root',
            env: 'ROOT_PASSWORD'
        }
    },
    oauth: {
        allowed_grants: {
            doc: 'An array of oauth2 grants are allowed.',
            default: ['password', 'refresh_token', 'client_credentials']
        },
        refresh_token_lifetime: {
            doc: 'Refresh token lifetime in seconds.',
            format: 'int',
            default: 3600*24*365
        },
        access_token_lifetime: {
            doc: 'Access token lifetime in seconds.',
            format: 'int',
            default: 3600
        }
    },
    bcrypt_cost_factor: {
        doc: 'Username of root user.',
        default: 10,
        env: 'BCRYPT_COST_FACTOR'
    },
    log: {
        stdout: {
            level: {
                doc: 'Log everything from this level and above. Set \'none\' to disable the log stream.',
                format: ['none', 'verbose', 'debug', 'info', 'warn', 'error'],
                default: 'none',
                env: 'LOG_STDOUT_LEVEL'
            }
        },
        loggly: {
            level: {
                doc: 'Log everything from this level and above. Set to \'none\' to disable the log stream.',
                format: ['none', 'verbose', 'debug', 'info', 'warn', 'error'],
                default: 'info',
                env: 'LOGGLY_LEVEL'
            },
            token: {
                doc: 'The loggly token.',
                default: '',
                env: 'LOGGLY_TOKEN'
            },
            subdomain: {
                doc: 'The loggly subdomain.',
                default: '',
                env: 'LOGGLY_SUBDOMAIN'
            },
            tags: {
                doc: 'An array of tags to send to loggly with each log request',
                default: [os.hostname(), 'patterncatalog'],
                format: Array,
                env: 'LOGGLY_TAGS'
            }
        }
    }
};
