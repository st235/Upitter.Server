'use strict';

const counterConfig = require('../config/counter');

module.exports = mongoose => {
	const Schema = mongoose.Schema;
	const commentsSchema = new Schema({
		customId: {
			type: String,
			unique: true
		},
		author: {
			type: String,
			required: true
		},
		text: {
			type: String,
			required: true
		},
		isRemoved: {
			type: Boolean,
			default: false
		},
		createdDate: {
			type: Date
		}
	});

	commentsSchema.pre('save', function (next) {
		if (this.customId) return next();

		this
			.model('_Counters')
			.findAndModify(counterConfig.comments.name, counterConfig.comments.defaultIndex)
			.then(index => {
				this.customId = index;
				next();
			})
			.catch(error => next(error));
	});

	commentsSchema.statics.getComents = function (limit, offset) {
		return this.find({ isRemoved: false }).sort({ createdDate: -1 }).skip(offset).limit(limit).exec();
	};

	return mongoose.model('Comments', commentsSchema);
};
