module.exports = {
	application: {
		commandBasePath: `${__dirname}/../application/command`,
		handlerBasePath: `${__dirname}/../application/handler`,
	},

	api: {
		version: '0.0.1',
		prefix: '/api',
		controllerPath: `${__dirname}/../interfaces/http/controller`,
		pagination: {
			limit: 10,
		}
	},

	server: {
		port: process.env.PORT || 8080, host: ''
	},

	database: {
		host: '',
		port: 27017,
		name: '',
		username: null,
		password: null,
		options: {},
	}
};
