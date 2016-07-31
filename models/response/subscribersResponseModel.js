'use strict';

const _ = require('underscore');

module.exports = (company, userId) => {
	const subscribersResponse = {
		customId: company.customId,
		count: 0,
		userInSubscribers: false
	};

	if (company.subscribers && company.subscribers.length > 0 && company.subscribers[0].customId) {
		subscribersResponse.count = company.subscribers.length;
		subscribersResponse.subscribers = _.map(company.subscribers, subscriber => {
			if (!subscribersResponse.userInSubscribers && subscriber.customId === userId) subscribersResponse.userInSubscribers = true;
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
