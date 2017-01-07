'use strict';

const counterConfig = require('../config/counter');

module.exports = mongoose => {
	const Schema = mongoose.Schema;

	const commentSchema = new Schema({
		customId: {
			type: Number,
			unique: true
		},
		postId: {
			type: Number,
			sparse: true
		},
		authorUser: {
			type: String,
			ref: 'Users'
		},
		authorCompany: {
			type: String,
			ref: 'Companies'
		},
		text: {
			type: String,
			required: true
		},
		replyToUser: {
			type: String,
			ref: 'Users'
		},
		replyToCompany: {
			type: String,
			ref: 'Companies'
		},
		isRemoved: {
			type: Boolean,
			default: false
		},
		createdDate: {
			type: Date
		},
		reportVoters: {
			type: [String],
			default: []
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

	commentSchema.statics.getCommentById = function (customId) {
		return this
			.findOne({ customId })
			.populate('authorUser')
			.populate('authorCompany')
			.populate('replyToUser')
			.populate('replyToCompany')
			.exec()
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	};

	commentSchema.statics.getComments = function (limit, postId, commentId, type) {
		const query = { postId: parseInt(postId, 10), isRemoved: false };

		if (commentId) {
			switch (type) {
			case 'old':
				query.customId = { $lt: commentId };
				break;
			case 'new':
				query.customId = { $gt: commentId };
				break;
			default:
				throw 'INTERNAL_SERVER_ERROR';
				break;
			}
		}

		return this
			.find(query)
			.populate('authorUser')
			.populate('authorCompany')
			.populate('replyToUser')
			.populate('replyToCompany')
			.sort({ createdDate: -1 })
			.limit(parseInt(limit))
			.exec()
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	};

	commentSchema.statics.countComments = function (postId) {
		return this
			.find({ postId: parseInt(postId, 10), isRemoved: false })
			.count()
			.exec()
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	};

	return mongoose.model('Comments', commentSchema);
};
