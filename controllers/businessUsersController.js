'use strict';

const BaseController = require('./baseController');
const ValidationUtils = require('../utils/validationUtils');
const businessUserResponse = require('../models/response/businessUserResponse');

class BusinessUsersController extends BaseController {
	constructor(businessUsersManager) {
		super({ businessUsersManager });
	}

	_onBind() {
		super._onBind();
		this.edit = this.edit.bind(this);
		this.getSubscribers = this.getSubscribers.bind(this);
	}

	_onCreate() {
		super._onCreate();
		this.validationUtils = new ValidationUtils;
	}

	edit(req, res, next) {
		const invalid = this.validate(req)
			.add('accessToken').should.exist().and.have.type('String')
			.add('name').should.have.type('String').and.be.in.rangeOf(3, 63)
			.add('description').should.have.type('String').and.be.in.rangeOf(3, 400)
			.add('site').should.have.type('String').and.be.in.rangeOf(3, 63)
			.validate();

		if (invalid) return next(invalid.name);

		const body = req.body;
		const company = req.userId;

		this
			.businessUsersManager
			.edit(company, body)
			.then(businessUser => this.success(res, businessUser))
			.catch(next);
	}

	getSubscribers(req, res) {
		this
			.businessUsersManager
			.getSubscribers(req.userId)
			.then(company => businessUserResponse(company))
			.then(response => this.success(res, response))
			.catch(next);
	}
}

module.exports = BusinessUsersController;
