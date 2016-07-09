'use strict';

const AppUnit = require('../app/unit');
const categoriesConfig = require('../config/categories');
const _ = require('underscore');

const categoryResponse = require('../models/response/categoryResponseModel');

class CategoriesManager extends AppUnit {
	constructor(categoryModel) {
		super({ categoryModel });
	}

	_onBind() {
		this._create = this._create.bind(this);
		this.getCategories = this.getCategories.bind(this);
		this.createDefault = this.createDefault.bind(this);
	}

	_create(data, customId) {
		data.customId = customId;
		const category = this.categoryModel(data);
		return category.save()
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	createDefault() {
		this
			.categoryModel
			.remove({})
			.then(_.map(categoriesConfig, (data, customId) => this._create(data, customId)))
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	getCategories(language) {
		return this
			.categoryModel
			.find()
			.exec()
			.then(categories => _.map(categories, category => categoryResponse(category, language)))
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	findCategory(id, language) {
		return this
			.categoryModel
			.findOne({ customId: id })
			.exec()
			.then(category => categoryResponse(category, language))
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}
}

module.exports = CategoriesManager;
