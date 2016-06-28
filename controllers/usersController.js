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
		this._getObjectsIds = this._getObjectsIds.bind(this);
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

	_getObjectsIds(ids) {
		return this
			.usersManager
			.getObjectId(ids.userId)
			.then(userObjectId => ids.userObjectId = userObjectId)
			.then(() => this.businessUsersManager.getObjectId(ids.companyId))
			.then(companyObjectId => ids.companyObjectId = companyObjectId)
			.then(() => ids);
	}

	addToSubscriptions(req, res, next) {
		const ids = {
			userId: req.userId,
			companyId: req.params.companyId
		};

		this
			._getObjectsIds(ids)
			.then(() => this.businessUsersManager.addUserToSubscribers(ids.userObjectId, ids.companyId))
			.then(() => this.usersManager.addCompanyToSubscriptions(ids.userId, ids.companyObjectId))
			.then(user => userResponse(user))
			.then(response => this.success(res, response))
			.catch(next);
	}

	removeFromSubscriptions(req, res, next) {
		const ids = {
			userId: req.userId,
			companyId: req.params.companyId
		};

		this
			._getObjectsIds(ids)
			.then(() => this.businessUsersManager.removeUserFromSubscribers(ids.userObjectId, ids.companyId))
			.then(() => this.usersManager.removeCompanyFromSubscriptions(ids.userId, ids.companyObjectId))
			.then(user => userResponse(user))
			.then(response => this.success(res, response))
			.catch(next);
	}

	getSubscriptions(req, res, next) {
		const userId = req.userId;

		this
			.usersManager
			.getSubscriptions(userId)
			.then(user => userResponse(user))
			.then(response => this.success(res, response))
			.catch(next);
	}
}

module.exports = UsersController;
