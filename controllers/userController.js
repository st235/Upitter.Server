'use strict';

const BaseController = require('./baseController');
const ValidationUtils = require('../utils/validationUtils');

const userResponse = require('../models/response/userResponseModel');
const subscriptionResponse = require('../models/response/subscriptionResponseModel');
const subscriptionsResponseModel = require('../models/response/subscriptionsResponseModel');

class UsersController extends BaseController {
	constructor(usersManager, companiesManager, notificationManager) {
		super({
			usersManager,
			companiesManager,
			notificationManager
		});
	}

	_onBind() {
		super._onBind();
		this.edit = this.edit.bind(this);
		this._getObjectsIds = this._getObjectsIds.bind(this);
		this.toggleSubscription = this.toggleSubscription.bind(this);
		this.getSubscriptions = this.getSubscriptions.bind(this);
		this.getProfile = this.getProfile.bind(this);
	}

	_onCreate() {
		super._onCreate();
		this.validationUtils = new ValidationUtils;
	}

	edit(req, res, next) {
		const { nickname, name, surname, sex, picture } = req.body;

		this
			.usersManager
			.edit(req.userId, nickname, name, surname, sex, picture)
			.then(user => this.success(res, userResponse(user)))
			.catch(next);
	}

	_getObjectsIds(ids) {
		return this
			.usersManager
			.getObjectId(ids.userId)
			.then(userObjectId => ids.userObjectId = userObjectId)
			.then(() => this.companiesManager.getObjectId(ids.companyId))
			.then(companyObjectId => ids.companyObjectId = companyObjectId)
			.then(() => ids);
	}

	toggleSubscription(req, res, next) {
		const invalid = this.validate(req)
			.add('companyId').should.exist().and.have.type('String')
			.validate();

		if (invalid) return next(invalid.name);

		const ids = {
			userId: req.userId,
			companyId: req.params.companyId
		};

		let subscribe;
		let company;

		this
			._getObjectsIds(ids)
			.then(() => this.usersManager.toggleCompanySubscription(ids.userId, ids.companyObjectId))
			.then(sub => {
				subscribe = sub;
				return this.companiesManager.toggleUserSubscription(ids.userObjectId, ids.companyId);
			})
			.then(currentCompany => {
				company = currentCompany;
				return this.notificationManager.create('like', ids.userObjectId, null, [ids.companyId], 'user');
			})
			.then(() => this.success(res, subscriptionResponse(company, subscribe)))
			.catch(next);
	}

	getSubscriptions(req, res, next) {
		const { userId } = req;
		const { limit = 20, companyId } = req.query;

		this
			.usersManager
			.getSubscriptions(userId)
			.then(user => subscriptionsResponseModel(user, parseInt(limit, 10), parseInt(companyId, 10)))
			.then(response => this.success(res, response))
			.catch(next);
	}

	getProfile(req, res, next) {
		const { userId } = req;

		this
			.usersManager
			.getProfile(userId)
			.then(user => this.success(res, userResponse(user)))
			.catch(next);
	}
}

module.exports = UsersController;
