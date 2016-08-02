'use strict';

const _ = require('underscore');

module.exports = (user, companyId) => {
	const subscriptionsResponse = {
		customId: user.customId,
		count: 0
	};

	if (user.subscriptions && user.subscriptions.length > 0 && user.subscriptions[0].customId) {
		subscriptionsResponse.count = user.subscriptions.length;
		subscriptionsResponse.subscriptions = _.map(user.subscriptions, subscription => {
			if (companyId) {
				subscriptionsResponse.companyInSubscriptions = !!(!subscriptionsResponse.userInSubscribers && subscription.customId === companyId);
			}

			return {
				customId: subscription.customId,
				name: subscription.name,
				logoUrl: subscription.sex
			};
		});
	}

	return subscriptionsResponse;
};
