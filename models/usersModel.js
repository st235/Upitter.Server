'use strict';
const counterConfig = require('../config/counterConfig');

module.exports = mongoose => {
	const Schema = mongoose.Schema;
	const usersSchema = new Schema({
		customId: {
			type: Number,
			unique: true
		},
		email: {
			type: String,
			unique: true,
			required: true
		},
		name: {
			type: String,
			required: true
		},
		picture: {
			type: String
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

	usersSchema.statics.findByEmail = function (email) {
		return this.findOne({ email: email }).exec();
	};

	return mongoose.model('Users', usersSchema);
};


