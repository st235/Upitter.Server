'use strict';
const counterConfig = require('../config/counter');

module.exports = mongoose => {
	const Schema = mongoose.Schema;
	const postsSchema = new Schema({
		customId: {
			type: String,
			unique: true
		},
		author: {
			type: String,
			required: true
		},
		title: {
			type: String,
			required: true
		},
		text: {
			type: String,
			required: true
		},
		logoUrl: {
			type: String
		},
		isRemoved: {
			type: Boolean,
			default: false
		},
		createdDate: {
			type: Date
		},
		updatedDate: {
			type: Date
		}
	});

	postsSchema.pre('save', function (next) {
		if (this.customId) return next();

		this
			.model('_Counters')
			.findAndModify(counterConfig.posts.name, counterConfig.posts.defaultIndex)
			.then(index => {
				this.customId = index;
				next();
			})
			.catch(error => next(error));
	});

	postsSchema.statics.getPosts = function (limit, offset) {
		return this.find({ isRemoved: false }).sort({ createdDate: -1 }).skip(offset).limit(limit).exec();
	};

	return mongoose.model('Posts', postsSchema);
};
