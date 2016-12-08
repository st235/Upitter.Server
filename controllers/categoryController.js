'use strict';

const _ = require('underscore');

const BaseController = require('./baseController');
const ValidationUtils = require('../utils/validationUtils');

const categoryResponse = require('../models/response/categoryResponseModel');

class CategoriesController extends BaseController {
	constructor(categoriesManager) {
		super({ categoriesManager });
	}

	_onBind() {
		super._onBind();
		this.getCategories = this.getCategories.bind(this);
		this.findCategory = this.findCategory.bind(this);
		this.getParent = this.getParent.bind(this);
		this.obtainTitles = this.obtainTitles.bind(this);
	}

	_onCreate() {
		super._onCreate();
		this.validationUtils = new ValidationUtils;
	}

	getCategories(req, res, next) {
		this
			.categoriesManager
			.getCategories(req.ln)
			.then(categories => _.map(categories, category => categoryResponse(category, req.ln)))
			.then(categories => this.success(res, categories))
			.catch(next);
	}

	findCategory(req, res, next) {
		const { id } = req.params;

		this
			.categoriesManager
			.findCategory(id)
			.then(category => categoryResponse(category, req.ln))
			.then(category => this.success(res, category))
			.catch(next);
	}

	getParent(req, res, next) {
		const id = parseInt(parseInt(req.params.id, 10) / 100, 10) * 100;

		this
			.categoriesManager
			.findCategory(id)
			.then(category => categoryResponse(category, req.ln))
			.then(category => this.success(res, category))
			.catch(next);
	}

	obtainTitles(req, res, next) {
		const invalid = this.validate(req)
			.add('activity').should.exist().and.have.type('Array')
			.validate();

		//if (invalid) return next(invalid.name);

		const { activity } = req.body;

		Promise
			.resolve(_.map(activity, category => categoryResponse({ customId: category }, req.ln)))
			.then(activity => this.success(res, activity))
			.catch(next);
	}
}

module.exports = CategoriesController;
