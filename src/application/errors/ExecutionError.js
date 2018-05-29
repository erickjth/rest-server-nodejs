const { APPLICATION_ERRORS } = require('./index');

function ExecutionError(message, commandName, code) {
	this.message = message || `Something went wrong trying to run the command ${commandName}`;
	this.code = code || APPLICATION_ERRORS.EXECUTION_ERROR;

	this.toJSON = () => ({
		code: this.code,
		message: this.message,
	});
}

ExecutionError.prototype = new Error();
ExecutionError.prototype.name = 'ExecutionError';
ExecutionError.prototype.type = 'ApplicationError';
ExecutionError.prototype.constructor = ExecutionError;

module.exports = ExecutionError;
