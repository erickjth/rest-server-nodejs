const fs = require('fs');
const path = require('path');
const { MissingHandlerException, HandlerLocator } = require('simple-command-bus');

class AwilixHandlerLocator extends HandlerLocator {
	constructor(container) {
		super();
		this.container = container;

		const { config } = container;

		const handlersPath = config.application.handlerBasePath;

		if (!handlersPath || !isDirectory(handlersPath)) {
			throw new Error('Invalid commands path.');
		}

		this.handlers = walkSync(handlersPath);
	}

	getHandlerForCommand(commandName) {
		const handlerName = `${commandName.replace('Command', 'Handler')}.js`;
		const foundHandler = this.handlers.find(handler => handler.endsWith(handlerName));

		if (!foundHandler) {
			MissingHandlerException.forCommand(commandName);
		}

		const Handler = require(foundHandler); // eslint-disable-line global-require

		if (isFunction(Handler) === false) {
			MissingHandlerException.forCommand(commandName);
		}

		return new Handler(this.container);
	}
}

const isDirectory = dir => fs.lstatSync(dir).isDirectory();

const walkSync = file =>
	(isDirectory(file) ? fs.readdirSync(file).map(f => walkSync(path.join(file, f))) : file);

const isFunction = f => typeof f === 'function';

module.exports = AwilixHandlerLocator;
