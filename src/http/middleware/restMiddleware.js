const fs = require('fs');
const path = require('path');
const { get, chunk, capitalize, camelCase, isUndefined, isEmpty, isFunction } = require('lodash');
const config = require('../../config');
const { NotFound } = require('../errors/index');

/**
 * REST Middleware
 *
 * This middleware resolves the controller and action based
 * on the request path and method. E.g.
 *
 * GET /account => controller/AccountController.getCollectionAction
 * GET /account/id => controller/AccountController.getResourceAction (with request.params.account_id)
 * POST /account => controller/AccountController.postCollectionAction
 * PUT /account/id => controller/AccountController.putResourceAction
 * PATCH /account/id => controller/AccountController.patchResourceAction
 * DELETE /account/id => controller/AccountController.deleteResourceAction
 *
 * GET /account/id/contact => controller/account/ContactController.getCollectionAction (with request.params.account_id)
 * GET /account/id/contact/id2 => controller/account/ContactController.getResourceAction
 *                                (with request.params.account_id and request.params.contact_id)
 *
 * Requests like PUT /account or DELETE /account are not allowed by the REST definition
*/
module.exports = (app) => (request, response, next) => {
	const { baseUrl, method } = request;

	const prefix = `${config.api.prefix}/`;
	const requestPath = baseUrl.substring(prefix.length);

	let resourceName = '';
	let actionType = 'collection';

	// Resolve the controller based on the request path
	const resources = chunk(requestPath.split('/'), 2).reduce((carry, pair) => {
		let resource = get(pair, '[0]', null);
		const resourceId = get(pair, '[1]', null);

		resource = capitalize(camelCase(resource));

		const resourceIdKey = `${resource.toLowerCase()}_id`;

		// If the request has this format /resource/{id},
		// means that is requesting a resource with an id is present in the path.
		if (isUndefined(resourceId) === false && isEmpty(resourceId) === false) {
			// Set resource id into the request params
			request.params[resourceIdKey] = resourceId;
			actionType = 'resource';
		}
		// Otherwise is requestion a collection. (without id)

		resourceName = resource;
		carry.push(resource);

		return carry;
	}, []);

	// Set default controller if nothing matched
	if (isUndefined(resources[0]) === false && isEmpty(resources[0]) === true) {
		resourceName = resources[0] = 'default';
	}

	const controllerPath = `${path.join(config.api.controllerPath, [].concat(resources).join('/'))}Controller.js`;
	const constrollerAction = camelCase(`${method} ${actionType} Action`);

	// Check if the controller file exists
	if (fs.existsSync(controllerPath) === false) {
		throw new NotFound(`Resource ${resourceName} not found!`);
	}

	const Controller = require(controllerPath);

	const controllerInstance = new Controller(app);

	// Check if the action exists in the controller
	if (isFunction(controllerInstance[constrollerAction]) === false) {
		throw new NotFound(`${capitalize(actionType)} for resource ${resourceName} not found!`);
	}

	if (isFunction(controllerInstance.beforeAction) !== false) {
		request = controllerInstance.beforeAction(request);
	}

	controllerInstance[constrollerAction](request, response, next);
};
