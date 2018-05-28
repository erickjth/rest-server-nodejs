const Account = require('../../domain/account');
const ValidationError = require('../errors/ValidationError');
const ExecutionError = require('../errors/ExecutionError');

class CreateAccountHandler {
	constructor({ accountRepository }) {
		this.accountRepository = accountRepository;
	}

	async handle(command) {
		const rawData = command.getPayload();

		const { valid, errors } = Account.validate(rawData);

		if (valid === false) {
			throw new ValidationError(errors);
		}

		const existingAccount = await this.accountRepository.findByEmail(rawData.email);

		if (existingAccount !== null) {
			throw new ExecutionError(`Account with email ${rawData.email} already exists,`);
		}

		const newAccount = new Account(rawData);

		const createdAccount = await this.accountRepository.create(newAccount);

		return createdAccount;
	}
}

module.exports = CreateAccountHandler;
