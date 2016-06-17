'use strict';
const counterConfig = require('../config/counter');

module.exports = mongoose => {
	const Schema = mongoose.Schema;
	const feedbacksSchema = new Schema ({
		customId: {
			type: Number,
			unique: true
		},
		userId: {
			type: String,
			required: true
		},
		message: {
			type: String
		},
		createdDate: {
			type: Date
		}
	});

	feedbacksSchema.pre('save', function (next) {
		if (this.customId) return next();

		this
			.model('_Counters')
			.findAndModify(counterConfig.feedbacks.name, counterConfig.feedbacks.defaultIndex)
			.then(index => {
				this.customId = index;
				next();
			})
			.catch(error => next(error));
	});

	feedbacksSchema.statics.getFeedbacks = function (limit, offset) {
		return this.find().sort({ createdDate: -1 }).skip(offset).limit(limit).exec();
	};

	return mongoose.model('Feedbacks', feedbacksSchema);
};
