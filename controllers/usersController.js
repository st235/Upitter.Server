'use strict';

const BaseController = require('./baseController');
const ValidationUtils = require('../utils/validationUtils');
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

	_onCreate() {
		super._onCreate();
		this.validationUtils = new ValidationUtils;
	}

	edit(req, res) {
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
		const invalid = this.validate(req)
			.add('accessToken').should.exist().and.have.type('String')
			.add('companyId').should.exist().and.have.type('String')
			.validate();

		if (invalid) return next(invalid.name);

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
		const invalid = this.validate(req)
			.add('accessToken').should.exist().and.have.type('String')
			.add('companyId').should.exist().and.have.type('String')
			.validate();

		if (invalid) return next(invalid.name);

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
		const invalid = this.validate(req)
			.add('accessToken').should.exist().and.have.type('String')
			.validate();

		if (invalid) return next(invalid.name);

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
