'use strict';

const counterConfig = require('../config/counter');

module.exports = mongoose => {
	const Schema = mongoose.Schema;

	const commentSchema = new Schema({
		customId: {
			type: String,
			unique: true
		},
		author: {
			customId: {
				type: Number,
				sparse: true
			},
			nickname: {
				type: String,
				sparse: true,
				required: true
			},
			picture: {
				type: String
			}
		},
		text: {
			type: String,
			required: true
		},
		replyTo: {
			customId: {
				type: Number,
				sparse: true
			},
			nickname: {
				type: String,
				sparse: true
			}
		},
		isRemoved: {
			type: Boolean,
			default: false
		},
		createdDate: {
			type: Date
		}
	});

	commentSchema.pre('save', function (next) {
		if (this.customId) return next();

		this
			.model('_Counters')
			.findAndIncrement(counterConfig.comments.name, counterConfig.comments.defaultIndex)
			.then(index => {
				this.customId = index;
				next();
			})
			.catch(() => next('INTERNAL_SERVER_ERROR'));
	});

	commentSchema.statics.getComments = function (limit, offset) {
		return this
			.find({ isRemoved: false })
			.sort({ createdDate: -1 })
			.skip(offset)
			.limit(limit)
			.exec();
	};

	return mongoose.model('Comments', commentSchema);
};
