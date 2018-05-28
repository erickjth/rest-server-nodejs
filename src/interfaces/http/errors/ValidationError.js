const get = require('lodash/get');
const { HTTP_CODES } = require('./index');

function HttpValidationError(error) {
	this.message = get(error, 'message', 'Validation Error');
	this.errors = get(error, 'errors', []);
	this.code = HTTP_CODES.BadRequest;

	this.toJSON = () => ({
		code: this.code,
		message: this.message,
		errors: this.errors,
	});
}

HttpValidationError.prototype = new Error();
HttpValidationError.prototype.name = 'HttpValidationError';
HttpValidationError.prototype.type = 'httpError';
HttpValidationError.prototype.constructor = HttpValidationError;

module.exports = HttpValidationError;
