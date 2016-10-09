'use strict';

const AppUnit = require('../app/unit');

class NotificationManager extends AppUnit {
	constructor(notificationModel) {
		super({
			notificationModel
		});
	}

	_onBind() {
		this.create = this.create.bind(this);
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
}

module.exports = NotificationManager;
