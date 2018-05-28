const { Command } = require('simple-command-bus');

class CreateAccountCommand extends Command {
	constructor({ name, email }) {
		super();
		this.name = name;
		this.email = email;
	}

	getName() {
		return this.name;
	}

	getEmail() {
		return this.email;
	}

	getPayload() {
		return {
			name: this.name,
			email: this.email,
		};
	}
}

module.exports = CreateAccountCommand;
