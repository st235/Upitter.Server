'use strict';

module.exports = mongoose => {
	const Schema = mongoose.Schema;

	const categorySchema = new Schema({
		customId: {
			type: String,
			unique: true
		},
		title: {
			type: String,
			required: true
		},
		parentCategory: {
			type: Number
		},
		logoUrl: {
			type: String
		}
	});

	return mongoose.model('Categories', categorySchema);
};
