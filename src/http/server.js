const express = require('express');
const bodyParser = require('body-parser');
const config = require('../config');
const errorHandler = require('./errors/errorHandler');
const notFoundHandler = require('./errors/notFoundHandler');
const restMiddleware = require('./middleware/restMiddleware');

const app = express();

function createServer() {
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());
	app.set('services', { });

	// Forward every request that matches with the api prefix to the Rest middleware
	app.use(`${config.api.prefix}*`, restMiddleware(app));

	app.use(notFoundHandler());

	app.use(errorHandler());

	app.set('port', config.server.port);

	var server = app.listen(config.server.port, () => {
		console.log(`Express server listening on port ${server.address().port}`);
	});

	return server;
}

module.exports = createServer;
