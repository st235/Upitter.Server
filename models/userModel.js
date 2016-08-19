'use strict';

const counterConfig = require('../config/counter');

module.exports = mongoose => {
	const Schema = mongoose.Schema;

	const userSchema = new Schema({
		customId: {
			type: Number,
			unique: true
		},
		nickname: {
			type: String,
			sparse: true,
			required: true
		},
		name: {
			type: String
		},
		surname: {
			type: String
		},
		email: {
			type: String,
			unique: true,
			sparse: true
		},
		sex: {
			type: Number,
			default: 2
		},
		picture: {
			type: String
		},
		description: {
			type: String
		},
		isVerify: {
			type: Boolean,
			default: false
		},
		subscriptions: [{
			type: String,
			ref: 'Companies'
		}],
		favorites: [{
			type: String,
			ref: 'Posts'
		}],
		createdDate: {
			type: Date
		},
		socialId: {
			type: String,
			unique: true
		}
	});

	userSchema.pre('save', function (next) {
		if (this.customId) return next();

		this
			.model('_Counters')
			.findAndIncrement(counterConfig.users.name, counterConfig.users.defaultIndex)
			.then(index => {
				this.customId = index;
				next();
			})
			.catch(error => next(error));
	});

	return mongoose.model('Users', userSchema);
};
