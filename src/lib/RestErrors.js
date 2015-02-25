'use strict';

var util = require('util');

/**
* The abstract exception for REST service errors.
*
* @extends Error
* @param {Number} httpStatus The HTTP status code (for example 404 Not Found, 400 Bad Request, etc).
* @param {String} errorCode The error code.
* @param {String} message The error message.
*/
function RestError(httpStatus, errorCode, message) {
    Error.call(this, message);
    this.status = httpStatus;
    this.error = errorCode;
    this.error_description = message;
}
util.inherits(RestError, Error);
module.exports.RestError = RestError;

/**
* This error is thrown when a validation error occurred.
*
* @extends RestError
* @param {Object[]} errors An array containing one or more constraint violations.
*/
function ValidationError(errors) {
    RestError.call(this, 400, 'invalid_request', 'One or more request parameters are invalid');
    this.error_details = errors;
}
util.inherits(ValidationError, RestError);
module.exports.ValidationError = ValidationError;

/**
* This error should be thrown when an unknown error occurred.
*
* @extends RestError
* @param {Error} error The #rror object.
*/
function UnknownError(error) {
    RestError.call(this, 500, 'unknown_error', error.message);
}
util.inherits(UnknownError, RestError);
module.exports.UnknownError = UnknownError;
