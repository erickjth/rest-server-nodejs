const Account = require('../../../domain/account');

module.exports.toEntity = (documentData) => {
	if (!documentData) {
		return null;
	}

	const { _id: id, name, email, createdAt, updatedAt } = documentData;

	const account = new Account();

	account.fromData({ id, name, email, createdAt, updatedAt });

	return account;
};

module.exports.toDatabase = (account) => account.toObject();
