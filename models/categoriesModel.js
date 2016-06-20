'use strict';
const counterConfig = require('../config/counter');

module.exports = mongoose => {
	const Schema = mongoose.Schema;
	const categoriesSchema = new Schema ({
		customId: {
			type: String,
			unique: true
		},
		title: {
			type: String,
			required: true
		},
		parentCategory: {
			type: String
		},
		logoUrl: {
			type: String
		}
	});

	categoriesSchema.pre('save', function (next) {
		if (this.customId) return next();

		this
			.model('_Counters')
			.findAndModify(counterConfig.categories.name, counterConfig.categories.defaultIndex)
			.then(index => {
				this.customId = index;
				next();
			})
			.catch(error => next(error));
	});

	return mongoose.model('Categories', categoriesSchema);
};
