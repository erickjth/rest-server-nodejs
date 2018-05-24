const BaseController = require('./BaseController');
const config = require('../../config');

/**
 * Default controller handler.
 * The only purpose is to show the api version
 *
 * @class DefaultController
 * @extends {BaseController}
 */
class DefaultController extends BaseController {
	/**
	 * Get API version
	 * @param {*} request
	 * @param {*} response
	 * @param {*} next
	 */
	getCollectionAction(request, response) {
		response.json({ version: config.api.version });
	}
}

module.exports = DefaultController;
