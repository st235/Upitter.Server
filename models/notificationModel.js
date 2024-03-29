'use strict';

const counterConfig = require('../config/counter');

module.exports = mongoose => {
	const Schema = mongoose.Schema;

	const notificationSchema = new Schema({
		customId: {
			type: String,
			unique: true
		},
		type: {
			type: String,
			required: true
		},
		authorUser: {
			type: String,
			ref: 'Users'
		},
		authorCompany: {
			type: String,
			ref: 'Companies'
		},
		targetId: {
			type: Number
		},
		attachmentIds: {
			type: [String]
		},
		createdDate: {
			type: Date
		}
	});

	notificationSchema.pre('save', function (next) {
		if (this.customId) return next();

		this
			.model('_Counters')
			.findAndIncrement(counterConfig.notifications.name, counterConfig.notifications.defaultIndex)
			.then(index => {
				this.customId = index;
				next();
			})
			.catch(error => next(error));
	});

	notificationSchema.statics.obtainNotifications = function (type, notificationId) {
		let query = {};
		if (notificationId) {
			switch (type) {
			case 'old':
				query.customId = { $lt: notificationId };
				break;
			case 'new':
				query.customId = { $gt: notificationId };
				break;
			default:
				break;
			}
		}

		return this
			.find(query)
			.populate('authorUser')
			.populate('authorCompany')
			.sort({ createdDate: -1 })
			.exec()
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	};

	return mongoose.model('Notifications', notificationSchema);
};
