'use strict';

const _ = require('underscore');

module.exports = (subscribers, amount) => {
	const subscribersResponse = {
		amount
	};

	if (subscribers && subscribers.length > 0 && subscribers[0].customId) {
		subscribersResponse.subscribers = _.map(subscribers, subscriber => {
			return {
				customId: subscriber.customId,
				nickname: subscriber.nickname,
				logoUrl: subscriber.picture ? subscriber.picture : null
			};
		});
	}

	return subscribersResponse;
};
