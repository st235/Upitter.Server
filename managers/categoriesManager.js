'use strict';

const AppUnit = require('../app/unit');
const categoriesConfig = require('../config/categories');
const _ = require('underscore');

const categoryResponse = require('../models/response/categoryResponse');

class CategoriesManager extends AppUnit {
	constructor(categoriesModel) {
		super({ categoriesModel });
	}

	_onBind() {
		this._create = this._create.bind(this);
		this.getCategories = this.getCategories.bind(this);
		this.createDefault = this.createDefault.bind(this);
	}

	_create(data, customId) {
		data.customId = customId;
		const category = this.categoriesModel(data);
		return category.save()
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	createDefault() {
		this
			.categoriesModel
			.remove({})
			.then(_.map(categoriesConfig, (data, customId) => this._create(data, customId)))
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	getCategories(language) {
		return this
			.categoriesModel
			.find()
			.exec()
			.then(categories => _.map(categories, category => categoryResponse(category, language)))
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}
}

module.exports = CategoriesManager;
