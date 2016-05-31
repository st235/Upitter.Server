'use strict';

module.exports = mongoose => {
	const Schema = mongoose.Schema;
	const AccessTokenSchema = new Schema({
		userId: {
			type: String
		},
		businessUserId: {
			type: String
		},
		token: {
			type: String,
			unique: true
		},
		created: {
			type: Date,
			default: Date.now
		}
	});
	return mongoose.model('AccessToken', AccessTokenSchema);
};
