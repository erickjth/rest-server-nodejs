const mongoose = require('mongoose');

// create a schema
const AccountSchema = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	createdAt: Date,
	updatedAt: Date
});

var Account = mongoose.model('Account', AccountSchema);

module.exports = Account;
