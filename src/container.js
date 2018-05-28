const { createContainer, asValue, asFunction, asClass } = require('awilix');
const config = require('./config');
const database = require('./infrastructure/database');
const commandBus = require('./infrastructure/commandBus');
const awilixHandlerLocator = require('./infrastructure/commandBus/awilixHandlerLocator');
const server = require('./interfaces/http/server');
const router = require('./interfaces/http/router');
const accountRepository = require('./infrastructure/repository/account');
const application = require('./application');

const container = createContainer();

container.register({
	config: asValue(config),
	application: asFunction(application).singleton(),
	server: asFunction(server).singleton(),
	router: asFunction(router).singleton(),
	database: asFunction(database).singleton(),
	accountRepository: asClass(accountRepository).singleton(),
	commandBus: asFunction(commandBus).singleton(),
	awilixHandlerLocator: asClass(awilixHandlerLocator).singleton(),
});

module.exports = container;
