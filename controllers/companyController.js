'use strict';

const BaseController = require('./baseController');
const ValidationUtils = require('../utils/validationUtils');
const companyResponseModel = require('../models/response/companyResponseModel');
const subscribersResponseModel = require('../models/response/subscribersResponseModel');

const _ = require('underscore');

class CompanyController extends BaseController {
	constructor(companiesManager, usersManager) {
		super({
			companiesManager,
			usersManager
		});
	}

	_onBind() {
		super._onBind();

		this.edit = this.edit.bind(this);
		this.updateAddresses = this.updateAddresses.bind(this);
		this.getSubscribers = this.getSubscribers.bind(this);
		this.findByAlias = this.findByAlias.bind(this);
	}

	_onCreate() {
		super._onCreate();
		this.validationUtils = new ValidationUtils;
	}

	edit(req, res, next) {
		//TODO: Проверка на наличие хотя бы одного строкового символа
		const invalid = this.validate(req)
			//.add('name').should.have.type('String').and.be.in.rangeOf(3, 63)
			//.add('description').should.have.type('String').and.be.in.rangeOf(3, 400)
			//.add('site').should.have.type('String').and.be.in.rangeOf(3, 63)
			.validate();

		if (invalid) return next(invalid.name);

		const { userId } = req;
		const { alias, description, logoUrl, site, contactPhones, activity, socialLinks, name, coordinates } = req.body;
		if (alias && typeof alias === 'string' && (alias.length < 4 || alias.length > 25)) throw 'INTERNAL_SERVER_ERROR';

		this
			.companiesManager
			.edit(userId, { alias, description, logoUrl, site, contactPhones, activity, socialLinks, name, coordinates })
			.then(businessUser => this.success(res, companyResponseModel(businessUser)))
			.catch(next);
	}

	updateAddresses(req, res, next) {
		//TODO: Проверка на наличие хотя бы одного строкового символа
		const invalid = this.validate(req)
			.add('coordinates').should.have.type('Array')
			.validate();

		if (invalid) return next(invalid.name);

		const { userId } = req;
		const { coordinates } = req.body;

		this
			.companiesManager
			.edit(userId, { coordinates })
			.then(() => this.success(res, true))
			.catch(next);
	}

	findByAlias(req, res, next) {
		const invalid = this.validate(req)
			.add('alias').should.have.type('String')
			.validate();

		if (invalid) return next(invalid.name);

		const { alias } = req.params;
		const { userId } = req;
		let company;

		this
			.companiesManager
			.findByAlias(alias)
			.then(currentCompany => {
				company = currentCompany;
				return this.usersManager.findById(userId);
			})
			.then(user => companyResponseModel(company, user))
			.then(response => this.success(res, response))
			.catch(next);
	}

	getSubscribers(req, res, next) {
		const invalid = this.validate(req)
			.add('alias').should.exist().and.have.type('String')
			.validate();

		if (invalid) return next(invalid.name);

		const { limit = 20, alias, subId } = req.query;

		this
			.companiesManager
			.getSubscribers(alias, limit, subId)
			.then(({ subscribers, amount }) => this.success(res, subscribersResponseModel(subscribers, amount)))
			.catch(next);
	}
}

module.exports = CompanyController;
