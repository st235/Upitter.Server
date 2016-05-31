'use strict';

module.exports = mongoose => {
	const Schema = mongoose.Schema;
	const UsersSchema = new Schema({
		customId: {
			type: String,
			unique: true,
			required: true
		},
		name: {
			type: String,
			required: true
		},
		phone: {
			type: String,
			unique: true,
			required: true
		},
		numCode: {
			type: String
		},
		createdDate: {
			type: String,
			default: Date.now
		},
		email: {
			type: String
		},
		accessAttempts: {
			type: Number,
			default: 0
		},
		isBlocked: {
			type: Boolean,
			default: false
		}
	});
	return mongoose.model('Users', UsersSchema);
};
