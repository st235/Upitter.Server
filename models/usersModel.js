'use strict';
const counterConfig = require('../config/counter');

module.exports = mongoose => {
	const Schema = mongoose.Schema;
	const usersSchema = new Schema({
		customId: {
			type: Number,
			unique: true
		},
		email: {
			type: String,
			sparse: true,
			unique: true
		},
		name: {
			type: String,
			sparse: true,
			required: true
		},
		picture: {
			type: String
		},
		socialIds: {
			google: {
				type: String
			},
			facebook: {
				type: String
			},
			twitter: {
				type: String
			}
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
