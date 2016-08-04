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
		reason: [{
			type: String,
			required: true,
			ref: 'ReportReasons'
		}],
		author: [{
			type: String,
			required: true,
			ref: 'Users'
		}],
		postId: [{
			type: String,
			ref: 'Posts'
		}],
		companyId: [{
			type: String,
			ref: 'Companies'
		}],
		commentId: [{
			type: String,
			ref: 'Comments'
		}],
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
