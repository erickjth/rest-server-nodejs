const merge = require('lodash/merge');

class Model {
	toObject() {
		return this.toJSON();
	}

	fromData(data) {
		merge(this, data);
	}
}

module.exports = Model;
