const has = require('lodash/has');

class SearchAccountsHandler {
	constructor({ accountRepository }) {
		this.accountRepository = accountRepository;
	}

	async handle(command) {
		const { filter, fields, pagination } = command.getOptions();

		if (has(filter, 'id')) {
			filter._id = filter.id;
			delete filter.id;
		}

		const accounts = await this.accountRepository.findAll(
			filter,
			fields,
			pagination
		);

		return accounts;
	}
}

module.exports = SearchAccountsHandler;
