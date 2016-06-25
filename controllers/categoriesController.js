'use strict';

const BaseController = require('./baseController');
const ValidationUtils = require('../utils/validationUtils');

class CategoriesController extends BaseController {
	constructor(categoriesManager) {
		super({ categoriesManager });
	}

	_onBind() {
		super._onBind();
		this.getCategories = this.getCategories.bind(this);
	}

	_onCreate() {
		this.validationUtils = new ValidationUtils;
	}

	getCategories(req, res, next) {
		this
			.categoriesManager
			.getCategories()
			.then(categories => this.success(res, categories))
			.catch(next);
	}
}

module.exports = CategoriesController;
