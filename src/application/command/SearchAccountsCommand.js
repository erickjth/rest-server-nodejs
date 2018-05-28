const { Command } = require('simple-command-bus');

class SearchAccountsCommand extends Command {
	constructor(opts) {
		super();

		this.options = Object.assign({}, {
			filter: {},
			fields: [],
			pagination: {
				limit: 10,
				after: null,
				before: null,
			}
		}, opts);
	}

	getOptions() {
		return this.options;
	}

	getPayload() {
		return this.options;
	}
}

module.exports = SearchAccountsCommand;
