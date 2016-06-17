'use strict';
const counterConfig = require('../config/counter');

module.exports = mongoose => {
	const Schema = mongoose.Schema;
	const businessUsersSchema = new Schema({
		customId: {
			type: String,
			unique: true,
			required: true
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
