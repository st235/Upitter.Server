'use strict';
const LocaleService = require('default-locale');

module.exports = (notification, language) => {
	const notificationResponse = {
		customId: notification.customId,
		type: notification.type,
		text: LocaleService.getString(`${notification.type}`, language),
		authorId: notification.authorCompany ? notification.authorCompany.customId : notification.authorUser.customId,
		createdDate: notification.createdDate
	};

	if (notification.authorCompany) {
		notificationResponse.author = {
			authorId: notification.authorCompany.customId,
			name: notification.authorCompany.name,
			avatar: notification.authorCompany.logoUrl
		};
		notificationResponse.text = `${notification.authorCompany.name} ${LocaleService.getString(`${notification.type}`, language)}`;
	}
	if (notification.authorUser) {
		notificationResponse.author = {
			authorId: notification.authorUser.customId,
			name: notification.authorUser.nickname,
			avatar: notification.authorUser.picture
		};
		notificationResponse.text = `${notification.authorUser.nickname} ${LocaleService.getString(`${notification.type}`, language)}`;
	}
	if (notification.type === 'like' || notification.type === 'post') notificationResponse.postId = notification.targetId;

	return notificationResponse;
};
