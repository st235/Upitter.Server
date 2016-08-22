'use strict';

const _ = require('underscore');
const counterConfig = require('../config/counter');

module.exports = mongoose => {
	const Schema = mongoose.Schema;

	const postSchema = new Schema({
		customId: {
			type: Number,
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
			type: Schema.Types.ObjectId,
			ref: 'PostComments'//  TODO: add reference to comment Model
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
		watches: {
			type: Number,
			default: 0
		},
		watchers: [{
			type: String,
			ref: 'Users'
		}],
		favorites: {
			type: Number,
			default: 0
		},
		favoriteVoters: [{
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
		images: [{
			fid: {
				type: String,
				require: true
			},
			uuid: {
				type: String,
				require: true
			},
			width: {
				type: Number,
				require: true
			},
			height: {
				type: Number,
				require: true
			},
			aspectRatio: {
				type: Number,
				require: true
			},
			type: {
				type: String,
				require: true
			},
			originalUrl: {
				type: String,
				require: true
			},
			thumbUrl: {
				type: String
			},
			hash: {
				type: String,
				require: true
			}
		}],
		location: {
			type: [Number],
			required: true,
			index: '2dsphere'
		},
		votersForVariants: [{
			type: [String],
			default: []
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

	postSchema.statics.getPosts = function (latitude, longitude, radius, limit, category) {
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

		if (category) query.category = category;

		return this
			.find(query)
			.sort({ createdDate: -1 })
			.limit(limit)
			.exec();
	};

	postSchema.statics.getNew = function (postId, latitude, longitude, radius, category) {
		postId = parseInt(postId, 10);

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
			isRemoved: false,
			customId: {
				$gt: postId
			}
		};

		if (category) query.category = category;

		return this
			.find(query)
			.sort({ createdDate: -1 })
			.exec();
	};

	postSchema.statics.getOld = function (postId, latitude, longitude, radius, category, limit) {
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
			isRemoved: false,
			customId: {
				$lt: postId
			}
		};

		if (category) query.category = category;

		return this
			.find(query)
			.sort({ createdDate: -1 })
			.limit(limit)
			.exec();
	};

	postSchema.statics.getPostsByCompany = function (companyId, limit, postId, type) {
		const query = { author: companyId };
		if (postId) {
			switch (type) {
			case 'old':
				query.customId = { $lt: postId };
				break;
			case 'new':
				query.customId = { $gt: postId };
				break;
			default:
				throw 'INTERNAL_SERVER_ERROR';
				break;
			}
		}

		return this
			.find(query)
			.sort({ createdDate: -1 })
			.limit(parseInt(limit, 10))
			.exec()
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	};

	return mongoose.model('Posts', postSchema);
};
