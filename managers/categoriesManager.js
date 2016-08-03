'use strict';

const AppUnit = require('../app/unit');
const categoriesConfig = require('../config/categories');
const _ = require('underscore');

class CategoriesManager extends AppUnit {
	constructor(categoryModel) {
		super({ categoryModel });
	}

	_onBind() {
		this._create = this._create.bind(this);
		this.createDefault = this.createDefault.bind(this);
		this.getCategories = this.getCategories.bind(this);
	}

	_create(data, customId) {
		Object.assign(data, { customId });
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
			.then(_.each(categoriesConfig, (data, customId) => this._create(data, customId)))
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

	findCategory(customId) {
		return this
			.categoryModel
			.findOne({ customId })
			.exec()
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}
}

module.exports = CategoriesManager;
