const Yup = require('yup');
const { get, merge, pick } = require('lodash');
const { NotFound } = require('../errors');
const BaseController = require('./BaseController');

class AccountController extends BaseController {
	/**
	 * Get a collection of accounts
	 *
	 * @param {*} request
	 * @param {*} response
	 * @param {*} next
	 */
	async getCollectionAction(request, response, next) {
		try {
			const schema = Yup.object({
				after: Yup.string(),
				before: Yup.string(),
				limit: Yup.number().positive().integer(),
			});

			const queryParams = await schema.validate(
				schema.cast(request.query),
				{ abortEarly: true }
			).catch(e => this.throwValidationError(e));

			const pagination = merge(
				{ after: null, before: null, limit: this.app.get('config').api.pagination.limit },
				pick(queryParams, ['after', 'before', 'limit'])
			);

			const result = await this.commandBus.searchAccounts({ pagination });

			this.responseWithPagination(response, result);
		} catch (e) {
			next(e);
		}
	}

	/**
	 * Get account details
	 *
	 * @param {*} request
	 * @param {*} response
	 */
	async getResourceAction(request, response, next) {
		try {
			const id = request.params['account_id'];

			const result = await this.commandBus.searchAccounts({
				filter: { id }
			});

			const account = get(result, '[0]', null);

			if (account === null) {
				throw new NotFound(`Account with id ${id} not found`);
			}

			this.successResponse(response, account);
		} catch (e) {
			next(e);
		}
	}

	/**
	 * Create a new account
	 *
	 * @param {*} request
	 * @param {*} response
	 * @param {*} next
	 */
	async postCollectionAction(request, response, next) {
		try {
			const schema = Yup.object({
				name: Yup.string().required(),
				email: Yup.string().required().email(),
			});

			const value = await schema.validate(request.body, { abortEarly: true })
				.catch(e => this.throwValidationError(e));

			const result = await this.commandBus.createAccount(value);

			this.successResponse(response, result);
		} catch (e) {
			next(e);
		}
	}
}

module.exports = AccountController;
