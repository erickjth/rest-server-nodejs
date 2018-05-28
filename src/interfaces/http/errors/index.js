const HTTP_CODES = {
	BadRequest: 400,
	NotAuthenticated: 401,
	PaymentError: 402,
	Forbidden: 403,
	NotFound: 404,
	MethodNotAllowed: 405,
	NotAcceptable: 406,
	Timeout: 408,
	Conflict: 409,
	LengthRequired: 411,
	Unprocessable: 422,
	TooManyRequests: 429,
	GeneralError: 500,
	NotImplemented: 501,
	BadGateway: 502,
	Unavailable: 503
};

/**
 * Helper class to create new Error Types based on HTTP errors
 */
function createHttpError(name, init) {
	function E(message, code, ...args) {
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, this.constructor);
		} else {
			this.stack = (new Error()).stack;
		}

		this.message = message;
		this.code = code;
		this.toJSON = () => ({ code: this.code, message: this.message, stack: this.stack });

		if (init) {
			init.apply(this, [message, code, ...args]);
		}
	}

	E.prototype = new Error();
	E.prototype.name = name;
	E.prototype.type = 'httpError';
	E.prototype.constructor = E;

	return E;
}

// 400 - Bad Request
module.exports.BadRequest = createHttpError('BadRequest', function(message) {
	this.message = message || 'Bad Request';
	this.code = HTTP_CODES.BadRequest;
});

// 403 - Forbidden
module.exports.Forbidden = createHttpError('Forbidden', function(message) {
	this.message = message || 'Forbidden';
	this.code = HTTP_CODES.Forbidden;
});

// 404 - Not Found
module.exports.NotFound = createHttpError('NotFound', function(message) {
	this.message = message || 'Not Found';
	this.code = HTTP_CODES.NotFound;
});

// 405 - Method Not Allowed
module.exports.MethodNotAllowed = createHttpError('MethodNotAllowed', function(message) {
	this.message = message || 'Method Not Allowed';
	this.code = HTTP_CODES.MethodNotAllowed;
});

// 406 - Not Acceptable
module.exports.NotAcceptable = createHttpError('NotAcceptable', function(message) {
	this.message = message || 'Not Acceptable';
	this.code = HTTP_CODES.NotAcceptable;
});

// 408 - Timeout
module.exports.Timeout = createHttpError('Timeout', function(message) {
	this.message = message || 'Timeout';
	this.code = HTTP_CODES.Timeout;
});

// 500 - General Error
module.exports.GeneralError = createHttpError('GeneralError', function(message, code) {
	this.message = message || 'GeneralError';
	this.code = code || HTTP_CODES.GeneralError;
});

// 400 - Invalid argument
module.exports.InvalidArgumentError = createHttpError('InvalidArgumentError', function(message) {
	this.message = message || 'Invalid request';
	this.code = HTTP_CODES.BadRequest;
});

module.exports.HTTP_CODES = HTTP_CODES;

module.exports.createHttpError = createHttpError;
