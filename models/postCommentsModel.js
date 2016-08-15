'use strict';

const counterConfig = require('../config/counter');

module.exports = mongoose => {
	const Schema = mongoose.Schema;

	const Comment = new Schema({
		customId: {
			type: String
		},
		author: {
			customId: {
				type: Number
			},
			nickname: {
				type: String
			},
			picture: {
				type: String
			}
		},
		text: {
			type: String
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
			type: Boolean
		},
		createdDate: {
			type: Date
		}
	});

	const postCommentsSchema = new Schema({
		customId: {
			type: String,
			unique: true
		},
		postId: {
			type: String,
			unique: true
		},
		comments: {
			type: [Comment]
		}
	});
	postCommentsSchema.pre('save', function (next) {
		if (this.customId) return next();

		this
			.model('_Counters')
			.findAndIncrement(counterConfig.postComments.name, counterConfig.postComments.defaultIndex)
			.then(index => {
				this.customId = index;
				next();
			})
			.catch(() => next('INTERNAL_SERVER_ERROR'));
	});

	return mongoose.model('PostComments', postCommentsSchema);
};
