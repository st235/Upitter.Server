'use strict';

const AppUnit = require('../app/unit');

class CategoriesManager extends AppUnit {
	constructor(categoriesModel) {
		super({ categoriesModel });
	}

	_onBind() {
		this.create = this.create.bind(this);
		this.getCategories = this.getCategories.bind(this);
	}

	create(data) {
		const category = new this.categoriesModel(data);
		return category.save();
	}

	getCategories() {
		return this.categoriesModel.find().exec();
	}
}

module.exports = CategoriesManager;
