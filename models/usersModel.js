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
			unique: true
		},
		name: {
			type: String,
			required: true
		},
		picture: {
			type: String
		},
		socialIds: {
			google: {
				type: Number
			},
			facebook: {
				type: Number
			},
			twitter: {
				type: Number
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

	usersSchema.statics.findByGoogleId = function (googleId) {
		return this.findOne({ 'socialIds.google': googleId }).exec();
	};

	usersSchema.statics.findByFacebookId = function (facebookId) {
		return this.findOne({ 'socialIds.facebook': facebookId }).exec();
	};
	
	usersSchema.statics.findByTwitterId = function (twitterId) {
		return this.findOne({ 'socialIds.twitter': twitterId }).exec();
	};

	return mongoose.model('Users', usersSchema);
};
