const { APPLICATION_ERRORS } = require('./index');
const get = require('lodash/get');

function ValidationError(errors) {
	this.message = 'Validation Error';

	this.errors = errors.details.map((error) => error.message);
	this.code = APPLICATION_ERRORS.VALIDATION_ERROR;

	this.toJSON = () => ({
		code: this.code,
		message: this.message,
		error: get(this.errors, '[0]', 'Unknown Error'),
	});
}

ValidationError.prototype = new Error();
ValidationError.prototype.name = 'ValidationError';
ValidationError.prototype.type = 'ApplicationError';
ValidationError.prototype.constructor = ValidationError;

module.exports = ValidationError;
