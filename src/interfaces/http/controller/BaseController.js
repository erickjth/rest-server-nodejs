const { get, isArray, last, first } = require('lodash');
const { MethodNotAllowed } = require('../errors/index');
const ValidationError = require('../errors/ValidationError');

const PAYLOAD = 'data';
const PAGINATION = 'pagination';

/**
 * Base controller for REST
 */
class BaseController {
	constructor(app, request, response, next) {
		this.app = app;
		this.container = app.get('container');
		this.commandBus =this.container.commandBus;
		this.request = request;
		this.response = response;
		this.next = next;
	}

	putCollectionAction(request) {
		throw new MethodNotAllowed(`Method ${request.method} not supported`);
	}

	patchCollectionAction(request) {
		throw new MethodNotAllowed(`Method ${request.method} not supported`);
	}

	deleteCollectionAction(request) {
		throw new MethodNotAllowed(`Method ${request.method} not supported`);
	}

	throwValidationError(error) {
		throw new ValidationError(error);
	}

	successResponse(response, data) {
		response.json({ [PAYLOAD]: data });
	}

	responseWithPagination(response, data) {
		const pagination = {};

		const fullUrl = `${this.request.protocol}://${this.request.get('host')}${this.request.baseUrl}`;

		const limit = get(this.request.query, 'limit', null);

		if (isArray(data) === true) {
			pagination.next = `${fullUrl}?after=${get(last(data), 'id', null)}${limit ? `&limit=${limit}`: ''}`;
			pagination.before = `${fullUrl}?before=${get(first(data), 'id', null)}${limit ? `&limit=${limit}`: ''}`;
		}

		response.json({
			[PAYLOAD]: data,
			[PAGINATION]: pagination
		});
	}
}

module.exports = BaseController;
