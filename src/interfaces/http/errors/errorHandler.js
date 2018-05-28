const { GeneralError } = require('./index');

const defaults = {
	logger: console
};

module.exports = function(options = {}) {
	options = Object.assign({}, defaults, options);

	return (error, request, response, next) => { // eslint-disable-line no-unused-vars
		// Log the error if it didn't come from a service method call
		if (options.logger && typeof options.logger.error === 'function') {
			//options.logger.error(error);
		}

		if (error.type === 'ApplicationError') {
			error = new GeneralError(error.message, 400);
		} else if (error.type !== 'httpError') {
			const oldError = error;
			error = new GeneralError(oldError.message);

			if (oldError.stack) {
				error.stack = oldError.stack;
			}
		}

		error.code = !isNaN(parseInt(error.code, 10)) ? parseInt(error.code, 10) : 500;

		if (error.code === 404) {
			error.stack = null;
		}

		const output = Object.assign({}, error.toJSON());

		if (process.env.NODE_ENV === 'production') {
			delete output.stack;
		}

		response.set('Content-Type', 'application/json');
		response.status(error.code);
		response.json(output);
	};
};
