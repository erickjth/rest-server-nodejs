const { attributes } = require('structure');
const Model = require('../shared/model');

class AccountModel extends Model {}

const Account = attributes({
	id: String,
	name: String,
	email: {
		type: String,
		email: true,
	},
	createdAt: {
		type: Date,
		default: () => Date.now()
	},
	updatedAt: {
		type: Date,
		default: () => Date.now()
	},
})(AccountModel);

module.exports = Account;
