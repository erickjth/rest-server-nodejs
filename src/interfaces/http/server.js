const express = require('express');

module.exports = (container) => {
	const app = express();
	const { config, router } = container;

	app.set('config', config);
	app.set('container', container);

	app.use(router);

	return {
		start: () => {
			const server = app.listen(config.server.port, () => {
				console.log(`Express server listening on port ${server.address().port}`);
			});

			return server;
		}
	};
};
