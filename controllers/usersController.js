'use strict';

const BaseController = require('./baseController');
const userResponse = require('../models/response/userResponse');

class UsersController extends BaseController {
	constructor(usersManager, businessUsersManager) {
		super({ usersManager, businessUsersManager });
	}

	_onBind() {
		super._onBind();
		this.edit = this.edit.bind(this);
		this.addToSubscriptions = this.addToSubscriptions.bind(this);
		this.removeFromSubscriptions = this.removeFromSubscriptions.bind(this);
		this.getSubscriptions = this.getSubscriptions.bind(this);
	}

	edit(req, res) {
		this
			.usersManager
			.edit(req.userId, req.body)
			.then(user => userResponse(user))
			.then(response => this.success(res, response))
			.catch(error => this.error(res, error));
	}

	addToSubscriptions(req, res) {
		const userId = req.userId;
		const companyId = req.params.companyId;

		this
			.usersManager
			.addCompanyToSubscriptions(userId, companyId)
			.then(() => this.businessUsersManager.addUserToSubscribers(userId, companyId))
			.then(company => this.success(res, company))
			.catch(error => this.error(res, error));
	}

	removeFromSubscriptions(req, res) {
		const userId = req.userId;
		const companyId = req.params.companyId;

		this
			.usersManager
			.removeCompanyFromSubscriptions(userId, companyId)
			.then(() =>	this.businessUsersManager.removeUserFromSubscribers(userId, companyId))
			.then(company => this.success(res, company))
			.catch(error => this.error(res, error));
	}

	getSubscriptions(req, res) {
		const userId = req.userId;

		this
			.usersManager
			.getSubscriptionIds(userId)
			.then(subsIds => this.businessUsersManager.asd(subsIds.subscriptions))
			.then(companies => this.success(res, companies))
			.catch(error => this.error(res, error));
	}
}

module.exports = UsersController;
