const fs = require('fs');
const path = require('path');
const { get, chunk, capitalize, camelCase, isUndefined, isEmpty, isFunction } = require('lodash');
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
module.exports = (request, response, next) => {
	const { app, baseUrl, method } = request;
	const { api } = app.get('config');

	const prefix = api.prefix;
	const requestPath = baseUrl.substring(prefix.length + 1);
	const constrollerBasePath = api.controllerPath;

	let resourceName = '';
	let actionType = 'collection';
	const ids = {};

	// Resolve the controller based on the request path
	const resources = chunk(requestPath.split('/'), 2).reduce((carry, pair) => {
		let resource = get(pair, '[0]', null);
		const resourceId = get(pair, '[1]', null);

		resource = capitalize(camelCase(resource));

		const resourceIdKey = `${resource.toLowerCase()}_id`;

		// If the request has this format /resource/{id},
		// means that is requesting a resource with an id is present in the path.
		if (resourceId !== null && isEmpty(resourceId) === false) {
			// Save the id for the resource
			ids[resourceIdKey] = resourceId;
			actionType = 'resource';
		}
		// Otherwise is requesting a collection. (without id)

		resourceName = resource;
		carry.push(resource);

		return carry;
	}, []);

	// Set default controller if nothing matched
	if (isUndefined(resources[0]) === false && isEmpty(resources[0]) === true) {
		resourceName = resources[0] = 'default';
	}

	const controllerPath = `${path.join(constrollerBasePath, [].concat(resources).join('/'))}Controller.js`;
	const constrollerAction = camelCase(`${method} ${actionType} Action`);

	// Check if the controller file exists
	if (fs.existsSync(controllerPath) === false) {
		throw new NotFound(`Resource ${resourceName} not found!`);
	}

	const Controller = require(controllerPath); // eslint-disable-line global-require

	const controllerInstance = new Controller(app, request, response, next);

	// Check if the action exists in the controller
	if (isFunction(controllerInstance[constrollerAction]) === false) {
		const id = ids[`${resourceName.toLowerCase()}_id`] || '';
		throw new NotFound(`${capitalize(actionType)} ${id} for ${resourceName} not found!`);
	}

	// Set ids into the request params
	request.params = Object.assign({}, request.params, ids);

	if (isFunction(controllerInstance.beforeAction) !== false) {
		request = controllerInstance.beforeAction(request);
	}

	const result = controllerInstance[constrollerAction](request, response, next);

	if (result instanceof global.Promise) {
		result.catch(e => next(e));
	}
};
