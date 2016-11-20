'use strict';

const AppUnit = require('../app/unit');
const _ = require('underscore');

class NotificationManager extends AppUnit {
	constructor(notificationModel) {
		super({
			notificationModel
		});
	}

	_onBind() {
		this.create = this.create.bind(this);
		this.obtain = this.obtain.bind(this);
	}

	create(type, author, targetId, attachmentIds, authorType) {
		const data = {
			type,
			attachmentIds,
			targetId,
			authorCompany: authorType === 'company' ? author : null,
			authorUser: authorType === 'user' ? author : null,
			createdDate: Date.now()
		};
		const notification = new this.notificationModel(data);

		return notification
			.save()
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	obtain(limit, userId, type, notificationId) {
		return this
			.notificationModel
			.obtainNotifications(type, notificationId)
			.then(notifications => {
				if (!notifications) throw 'INTERNAL_SERVER_ERROR';
				return _.map(notifications, notification => {
					if (_.contains(notification.attachmentIds, userId)) return notification;
				});
			})
			.then(promises => Promise.all(promises))
			.then(notifications => _.compact(notifications))
			.then(notifications => notifications.splice(0, limit));
	}

}

module.exports = NotificationManager;
