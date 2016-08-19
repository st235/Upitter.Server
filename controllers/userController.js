'use strict';

const BaseController = require('./baseController');
const ValidationUtils = require('../utils/validationUtils');
const userResponse = require('../models/response/userResponseModel');
const subscribersResponseModel = require('../models/response/subscribersResponseModel');
const subscriptionsResponseModel = require('../models/response/subscriptionsResponseModel');

class UsersController extends BaseController {
	constructor(usersManager, companiesManager) {
		super({ usersManager, companiesManager });
	}

	_onBind() {
		super._onBind();
		this.edit = this.edit.bind(this);
		this._getObjectsIds = this._getObjectsIds.bind(this);
		this.toggleSubscription = this.toggleSubscription.bind(this);
		this.getSubscriptions = this.getSubscriptions.bind(this);
	}

	_onCreate() {
		super._onCreate();
		this.validationUtils = new ValidationUtils;
	}

	edit(req, res, next) {
		const invalid = this.validate(req)
			//.add('nickname').should.have.type('String').and.be.in.rangeOf(2, 20)
			//.add('name').should.have.type('String').and.be.in.rangeOf(2, 20)
			//.add('surname').should.have.type('String').and.be.in.rangeOf(2, 30)
			//.add('email').should.have.type('String').and.be.in.rangeOf(2, 30)
			//.add('sex').should.have.type('String').and.be.in.rangeOf(0, 2)
			//.add('description').should.have.type('String').and.be.in.rangeOf(4, 400)
			.validate();

		if (invalid) return next(invalid.name);

		const body = req.body;

		this
			.usersManager
			.edit(req.userId, body)
			.then(user => userResponse(user))
			.then(response => this.success(res, response))
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

		this
			._getObjectsIds(ids)
			.then(() => this.usersManager.toggleCompanySubscription(ids.userId, ids.companyObjectId))
			.then(() => this.companiesManager.toggleUserSubscription(ids.userObjectId, ids.companyId))
			.then(company => subscribersResponseModel(company, ids.userId))
			.then(response => this.success(res, response))
			.catch(next);
	}

	getSubscriptions(req, res, next) {
		const userId = req.userId;

		this
			.usersManager
			.getSubscriptions(userId)
			.then(user => subscriptionsResponseModel(user))
			.then(response => this.success(res, response))
			.catch(next);
	}
}

module.exports = UsersController;
