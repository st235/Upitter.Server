'use strict';

const _ = require('underscore');

const AppUnit = require('../app/unit');
const categoriesConfig = require('../config/categories');

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

	getCategories() {
		return this
			.categoryModel
			.find()
			.exec()
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	findCategory(id) {

		return this
			.categoryModel
			.findOne({ customId: id })
			.exec()
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}
}

module.exports = CategoriesManager;
