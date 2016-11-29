'use strict';
const LocaleService = require('default-locale');
const userResponseModel = require('./userResponseModel');
const companyResponseModel = require('./companyResponseModel');

module.exports = (notification, language) => {
	const notificationResponse = {
		customId: notification.customId,
		type: notification.type,
		text: LocaleService.getString(`${notification.type}`, language),
		authorId: notification.authorCompany ? notification.authorCompany.customId : notification.authorUser.customId,
		createdDate: notification.createdDate
	};

	if (notification.authorCompany) {
		notificationResponse.company = companyResponseModel(notification.authorCompany);
		notificationResponse.text = `${notification.authorCompany.name} ${LocaleService.getString(`${notification.type}`, language)}`;
	}
	if (notification.authorUser) {
		notificationResponse.user = userResponseModel(notification.authorUser);
		notificationResponse.text = `${notification.authorUser.nickname} ${LocaleService.getString(`${notification.type}`, language)}`;
	}
	if (notification.type === 'like' || notification.type === 'post') notificationResponse.postId = notification.targetId;

	return notificationResponse;
};
