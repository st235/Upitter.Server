'use strict';

const counterConfig = require('../config/counter');

module.exports = mongoose => {
	const Schema = mongoose.Schema;

	const reportSchema = new Schema({
		customId: {
			type: String,
			unique: true,
			required: true
		},
		type: {
			type: String,
			required: true
		},
		reason: {
			type: String,
			required: true
		},
		description: {
			type: String
		},
		author: {
			type: String,
			required: true
		},
		targetId: {
			type: String,
			required: true
		},
		createdDate: {
			type: Date
		}
	});

	reportSchema.pre('save', function (next) {
		if (this.customId) return next();

		this
			.model('_Counters')
			.findAndIncrement(counterConfig.reports.name, counterConfig.reports.defaultIndex)
			.then(index => {
				this.customId = index;
				next();
			})
			.catch(error => next(error));
	});

	return mongoose.model('Reports', reportSchema);
};
