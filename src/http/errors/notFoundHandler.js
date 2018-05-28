const { NotFound } = require('./index');

module.exports = function({ verbose = false } = {}) {
	return (req, res, next) => {
		const { url } = req;
		const message = `Resource not found${verbose ? `: ' ${url}` : ''}`;
		next(new NotFound(message, { url }));
	};
};
