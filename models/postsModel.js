'use strict';
const counterConfig = require('../config/counter');
const _ = require('underscore');

module.exports = mongoose => {
	const Schema = mongoose.Schema;
	const postsSchema = new Schema({
		customId: {
			type: String,
			unique: true
		},
		author: {
			type: String,
			required: true,
			ref: 'BusinessUsers'
		},
		categories: {
			type: [String]
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
		comments: {
			type: [String]
		},
		createdDate: {
			type: Date,
			default: Date.now
		},
		updatedDate: {
			type: Date
		},
		rating: {
			type: Number,
			default: 0
		},
		variants: [{
			value: {
				type: String
			},
			count: {
				type: Number,
				default: 0
			}
		}],
		_voters: [{
			type: String,
			ref: 'Users'
		}],
		_votersForVariants: [{
			type: String,
			ref: 'Users'
		}]
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
		return this
			.find({ isRemoved: false })
			.sort({ createdDate: -1 })
			.skip(offset).limit(limit)
			.exec();
	};

	postsSchema.statics.ratingPlus = function (userId) {
		if (_.indexOf(this._voters, userId) > -1) {
			this._voters = _.without(this._voters, userId);
			this.rating--;
		} else {
			this._voters.push(userId);
			this.rating++;
		}
		return this.save();
	};

	return mongoose.model('Posts', postsSchema);
};
