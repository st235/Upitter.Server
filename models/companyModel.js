'use strict';

const counterConfig = require('../config/counter');
const socialList = require('../config/socialList');

module.exports = mongoose => {
	const Schema = mongoose.Schema;

	const companySchema = new Schema({
		customId: {
			type: Number,
			unique: true
		},
		alias: {
			type: String,
			unique: true,
			sparse: true
		},
		activity: [{ // TODO достигнуть единого нейминга categories
			type: String,
			required: true
		}],
		name: {
			type: String,
			required: true
		},
		description: {
			type: String
		},
		isVerify: {
			type: Boolean,
			default: false
		},
		logoUrl: {
			type: String
		},
		subscribers: [{
			type: String,
			ref: 'Users'
		}],
		moderatorsList: {
			type: [String]
		},
		createdDate: {
			type: Date
		},
		phone: {
			body: {
				type: String
			},
			code: {
				type: String
			},
			fullNumber: {
				type: String,
				unique: true
			}
		},
		site: {
			type: String
		},
		socialLinks: [{
			customId: {
				type: String
			},
			type: {
				type: String,
				enum: socialList
			},
			icon: {
				type: String
			},
			link: {
				type: String
			}
		}],
		coordinates: [{
			address: {
				type: String
			},
			latitude: {
				type: String
			},
			longitude: {
				type: String
			}
		}],
		contactPhones: {
			type: [String]
		},
		favorites: [{
			type: String,
			ref: 'Posts'
		}],
		rating: {
			type: Number,
			default: 0
		}
	});

	companySchema.pre('save', function (next) {
		if (this.customId) return next();

		this
			.model('_Counters')
			.findAndDecrement(counterConfig.companies.name, counterConfig.companies.defaultIndex)
			.then(index => {
				this.customId = index;
				next();
			})
			.catch(error => next(error));
	});

	companySchema.statics.findById = function (customId) {
		return this
			.findOne({ customId })
			.exec();
	};

	companySchema.statics.findByAlias = function (alias) {
		return this
			.findOne({ alias })
			.exec();
	};

	return mongoose.model('Companies', companySchema);
};
