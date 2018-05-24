const merge = require('lodash/merge');
const production = require('./production');
const development = require('./development');
const testing = require('./testing');
const base = require('./base');
const local = require('./local');

const configByEnvironment = { production, development, testing };

let config = null;

function createConfig() {
	// Cache if exists
	if (config !== null) {
		return config;
	}

	const env = process.env.NODE_ENV || 'development';

	// Get config file by environment
	const envConfig = configByEnvironment[env];

	config = merge({}, base, envConfig, local);

	// Build final config (overriden base with envConfig and local)
	return config;
}

module.exports = createConfig();
