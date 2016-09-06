'use strict';

const _ = require('underscore');

module.exports = (company, userId) => {
	const subscribersResponse = {
		amount: 0
	};

	if (company.subscribers && company.subscribers.length > 0 && company.subscribers[0].customId) {
		subscribersResponse.amount = company.subscribers.length;
		subscribersResponse.subscribers = _.map(company.subscribers, subscriber => {
			if (userId) {
				subscribersResponse.userInSubscribers = !!(!subscribersResponse.userInSubscribers && subscriber.customId === userId);
			}
			return {
				customId: subscriber.customId,
				nickname: subscriber.nickname,
				sex: subscriber.sex,
				avatar: subscriber.picture
			};
		});
	}

	return subscribersResponse;
};
