'use strict';
const counterConfig = require('../config/counter');

module.exports = mongoose => {
	const Schema = mongoose.Schema;
	const notificationsSchema = new Schema({
		customId: {
			type: String,
			unique: true,
			required: true
		},
		type: {
			type: String
		},
		description: {
			type: String
		},
		attachmentIds: {
			type: [String]
		},
		createdDate: {
			type: Date
		}
	});

	notificationsSchema.pre('save', function (next) {
		if (this.customId) return next();

		this
			.model('_Counters')
			.findAndModify(counterConfig.notifications.name, counterConfig.notifications.defaultIndex)
			.then(index => {
				this.customId = index;
				next();
			})
			.catch(error => next(error));
	});

	return mongoose.model('Notifications', notificationsSchema);
};