'use strict';
const counterConfig = require('../config/counter');

module.exports = mongoose => {
	const Schema = mongoose.Schema;
	const usersSchema = new Schema({
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
			sparse: true,
			unique: true
		},
		sex: {
			type: Number,
			default: 2
		},
		picture: {
			type: String
		},
		isVerify: {
			type: Boolean,
			default: false
		},
		subscriptions: {
			type: [String]
		},
		createdDate: {
			type: Date
		},
		socialId: {
			type: String,
			unique: true
		}
	});

	usersSchema.pre('save', function (next) {
		if (this.customId) return next();

		this
			.model('_Counters')
			.findAndModify(counterConfig.users.name, counterConfig.users.defaultIndex)
			.then(index => {
				this.customId = index;
				next();
			})
			.catch(error => next(error));
	});


	return mongoose.model('Users', usersSchema);
};
