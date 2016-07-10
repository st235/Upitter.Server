'use strict';

const BaseController = require('./baseController');
const ValidationUtils = require('../utils/validationUtils');
const CompanyResponseModel = require('../models/response/companyResponseModel');

class CompanyController extends BaseController {
	constructor(companiesManager) {
		super({ companiesManager });
	}

	_onBind() {
		super._onBind();

		this.edit = this.edit.bind(this);
		this.getSubscribers = this.getSubscribers.bind(this);
		this.findByAlias = this.findByAlias.bind(this);
	}

	_onCreate() {
		super._onCreate();
		this.validationUtils = new ValidationUtils;
	}

	edit(req, res, next) {
		const invalid = this.validate(req)
			.add('accessToken').should.exist().and.have.type('String')
			//.add('name').should.have.type('String').and.be.in.rangeOf(3, 63)
			//.add('description').should.have.type('String').and.be.in.rangeOf(3, 400)
			//.add('site').should.have.type('String').and.be.in.rangeOf(3, 63)
			.validate();

		if (invalid) return next(invalid.name);

		const { aliasId, description, logoUrl, site } = req.body;
		const companyId = req.userId;

		this
			.companiesManager
			.edit(companyId, aliasId, description, logoUrl, site)
			.then(businessUser => this.success(res, businessUser))
			.catch(next);
	}

	findByAlias(req, res, next) {
		const { aliasId } = req.params;

		this
			.companiesManager
			.findByAlias(aliasId)
			.then(company => CompanyResponseModel(company))
			.then(response => this.success(res, response))
			.catch(next);
	}

	getSubscribers(req, res, next) {
		this
			.companiesManager
			.getSubscribers(req.userId)
			.then(company => CompanyResponseModel(company))
			.then(response => this.success(res, response))
			.catch(next);
	}
}

module.exports = CompanyController;
