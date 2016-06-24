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

	getCategories(req, res) {
		this
			.categoriesManager
			.getCategories()
			.catch(next)
			.then(categories => this.success(res, categories))
			.catch(error => this.error(res, error));
	}
}

module.exports = CategoriesController;
