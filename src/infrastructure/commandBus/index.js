const {
	CommandBus,
	CommandHandlerMiddleware,
	ClassNameExtractor,
	CreateCommandBusProxy,
	HandleInflector,
} = require('simple-command-bus');

module.exports = ({ awilixHandlerLocator, config }) => {
	const { commandBasePath } = config.application;

	const commandHandlerMiddleware = new CommandHandlerMiddleware(
		new ClassNameExtractor(),
		awilixHandlerLocator,
		new HandleInflector()
	);

	const simpleCommandBus = new CommandBus([commandHandlerMiddleware]);

	return CreateCommandBusProxy(simpleCommandBus, commandBasePath);
};
