'use strict';

const BaseController = require('./baseController');
const ValidationUtils = require('../utils/validationUtils');

class CategoriesController extends BaseController {
	constructor(categoriesManager) {
		super({ categoriesManager });
	}

	_onBind() {
		super._onBind();
		this.create = this.create.bind(this);
		this.getCategories = this.getCategories.bind(this);
	}

	_onCreate() {
		this.validationUtils = new ValidationUtils;
	}

	create(req, res) {
		const body = req.body;
		console.log(body);

		const invalidBody = this.validationUtils.existAndTypeVerify(body, 'String', 'title');
		if (invalidBody) return this.error(res, invalidBody);

		this
			.categoriesManager
			.create(body)
			.then(category => this.success(res, category))
			.catch(error => this.error(res, error));
	}

	getCategories(req, res) {
		this
			.categoriesManager
			.getCategories()
			.then(categories => this.success(res, categories))
			.catch(error => this.error(res, error));
	}

}

module.exports = CategoriesController;
