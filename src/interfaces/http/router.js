const { Router } = require('express');
const bodyParser = require('body-parser');
const restMiddleware = require('./middleware/restMiddleware');
const errorHandler = require('./errors/errorHandler');
const notFoundHandler = require('./errors/notFoundHandler');

module.exports = ({ config }) => {
	const apiRouter = new Router();

	apiRouter.use(bodyParser.urlencoded({ extended: true }));
	apiRouter.use(bodyParser.json());

	const prefix = config.api.prefix;

	// Forward every request that matches with the api prefix to the Rest middleware
	apiRouter.use(`${prefix}*`, restMiddleware);

	apiRouter.use(notFoundHandler());
	apiRouter.use(errorHandler());

	return apiRouter;
};
