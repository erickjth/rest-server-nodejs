module.exports = {
	api: {
		version: '0.0.1',
		prefix: '/api',
		controllerPath: `${__dirname}/../http/controller`,
	},
	server: {
		port: process.env.PORT || 8080, host: ''
	},
};
