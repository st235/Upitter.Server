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
			type: [Comment], unique: true, sparse: true
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
