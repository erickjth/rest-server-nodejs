const mongoose = require('mongoose');

/**
 * Connect to mongoDb
 *
 * @returns Promise
 */
module.exports = ({ config }) => {
	const { host, port, name, username, password, options } = config.database;

	const connectionString = `mongodb://${username ? `${username}:${password}@` : ''}${host}:${port}/${name}`;

	mongoose.Promise = global.Promise;

	return {
		connect: () => mongoose.connect(connectionString, options),
	};
};
