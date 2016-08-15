'use strict';

const counterConfig = require('../config/counter');

module.exports = mongoose => {
	const Schema = mongoose.Schema;

	const reportSchema = new Schema({
		customId: {
			type: String,
			unique: true
		},
		type: {
			type: String,
			required: true
		},
		reason: {
			customId: {
				type: String,
				sparse: true,
				required: true
			},
			title: {
				type: String,
				sparse: true,
				required: true
			}
		},
		author: {
			customId: {
				type: Number,
				sparse: true,
				required: true
			},
			nickname: {
				type: String,
				sparse: true,
				required: true
			}
		},
		targetId: {
			type: String
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
