'use strict';

const _ = require('underscore');
const counterConfig = require('../config/counter');

module.exports = mongoose => {
	const Schema = mongoose.Schema;

	const postSchema = new Schema({
		customId: {
			type: String,
			unique: true
		},
		author: {
			type: String,
			required: true,
			ref: 'Companies'    //  TODO: решить проблему со сылками
		},
		title: {
			type: String,
			required: true
		},
		text: {
			type: String,
			required: true
		},
		category: {
			type: String,
			required: true
		},
		isRemoved: {
			type: Boolean,
			default: false
		},
		comments: {
			type: [String], //  TODO: add reference to comment Model
			default: []
		},
		createdDate: {
			type: Date,
			default: Date.now
		},
		updatedDate: {
			type: Date
		},
		likes: {
			type: Number,
			default: 0
		},
		likeVoters: [{
			type: String,
			ref: 'Users'
		}],
		variants: [{
			value: {
				type: String
			},
			count: {
				type: Number,
				default: 0
			},
			voters: {
				type: [String],
				default: []
			}
		}],
		media: [{
			kind: String,
			url: String
		}],
		location: {
			type: [Number],
			required: true,
			index: '2dsphere'
		},
		votersForVariants: [{
			type: String,
			ref: 'Users'
		}]
	});

	postSchema.pre('save', function (next) {
		if (this.customId) return next();

		this
			.model('_Counters')
			.findAndIncrement(counterConfig.posts.name, counterConfig.posts.defaultIndex)
			.then(index => {
				this.customId = index;
				next();
			})
			.catch(error => next(error));
	});

	postSchema.statics.getPosts = function (latitude, longitude, radius, limit, offset) {
		const query = {
			location: {
				$near: {
					$geometry: {
						type: 'Point',
						coordinates: [
							parseFloat(latitude),
							parseFloat(longitude)
						]
					},
					$maxDistance: radius
				}
			},
			isRemoved: false
		};

		return this
			.find(query)
			.sort({ createdDate: -1 })
			.skip(offset)
			.limit(limit)
			.exec();
	};

	return mongoose.model('Posts', postSchema);
};
