const { reverse, merge, isEmpty, isNumber } = require('lodash');
const Account = require('../../database/model/account');
const { toEntity, toDatabase } = require('./mapper');

class MongoAccountRepository {
	create(account) {
		const data = toDatabase(account);
		return Account.create(data).then(values => toEntity(values));
	}

	findAll(filter = {}, fields = [], pagination = {}) {
		let query = Account.find(filter);
		let needReverse = false;

		if (isEmpty(fields) === false) {
			query = query.select(fields.reduce((carry, field) => {
				carry[field] = 1;
				return carry;
			}, {}));
		}

		const { after, before, limit } = merge({ after: null, before: null, limit: null }, pagination);

		if (after !== null) {
			query = query.where('_id').gt(after).sort({ _id: 1 });
		} else if (before !== null) {
			query = query.where('_id').lt(before).sort({ _id: -1 });
			needReverse = true;
		}

		if (isNumber(limit) && limit > 0) {
			query = query.limit(limit);
		}

		return query.then(entries => {
			if (needReverse) {
				reverse(entries);
			}

			return entries.map(doc => toEntity(doc));
		});
	}

	findById(id) {
		return Account.findOne({ _id: id }).then(values => toEntity(values));
	}

	findByEmail(email) {
		return Account.findOne({ email }).then(values => toEntity(values));
	}
}

module.exports = MongoAccountRepository;
