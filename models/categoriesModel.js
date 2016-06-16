'use strict';

module.exports = mongoose => {
	const Schema = mongoose.Schema;
	const categoriesSchema = new Schema ({
		customId: {
			type: String,
			unique: true,
			required: true
		},
		title: {
			type: String,
			required: true
		},
		parentCategory: {
			type: String
		}
	});

	return mongoose.model('Categories', categoriesSchema);
};
