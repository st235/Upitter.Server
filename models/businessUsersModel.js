'use strict';
const counterConfig = require('../config/counter');

module.exports = mongoose => {
	const Schema = mongoose.Schema;
	const businessUsersSchema = new Schema({
		customId: {
			type: Number,
			unique: true
		},
		activity: {
			type: String,
			required: true
		},
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
		usersList: {
			type: [String]
		},
		moderatorsList: {
			type: [String]
		},
		addressesList: {
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
		}
	});

	businessUsersSchema.pre('save', function (next) {
		if (this.customId) return next();

		this
			.model('_Counters')
			.findAndModify(counterConfig.businessUsers.name, counterConfig.businessUsers.defaultIndex)
			.then(index => {
				this.customId = index;
				next();
			})
			.catch(error => next(error));
	});

	return mongoose.model('BusinessUsers', businessUsersSchema);
};
