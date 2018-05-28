const container = require('./src/container');

const application = container.resolve('application');

application.run().catch((error) => {
	console.error('Something went wrong:', error);
	process.exit();
});
