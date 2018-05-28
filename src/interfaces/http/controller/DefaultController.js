const BaseController = require('./BaseController');

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
		response.json({ version: this.app.get('config').api.version });
	}
}

module.exports = DefaultController;
