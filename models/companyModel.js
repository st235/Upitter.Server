'use strict';

const counterConfig = require('../config/counter');

module.exports = mongoose => {
	const Schema = mongoose.Schema;

	const companySchema = new Schema({
		customId: {
			type: Number,
			unique: true
		},
		activity: [{ // TODO достигнуть единого нейминга categories
			type: String,
			required: true
		}],
		name: {
			type: String,
			required: true
		},
		nickname: {
			type: String,
			unique: true
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
		contactsPhones: {
			type: [String]
		}
	});

	companySchema.pre('save', function (next) {
		if (this.customId) return next();

		this
			.model('_Counters')
			.findAndModify(counterConfig.companies.name, counterConfig.companies.defaultIndex)
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

	return mongoose.model('Companies', companySchema);
};