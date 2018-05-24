const { MethodNotAllowed } = require('../errors/index');

/**
 * Base controller for REST
 */
class BaseController {
	constructor(app) {
		this.app = app;
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
}

module.exports = BaseController;
