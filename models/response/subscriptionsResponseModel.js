'use strict';

const _ = require('underscore');
const companyResponse = require('./companyResponseModel');

module.exports = (user, companyId) => {
	const subscriptionsResponse = {
		customId: user.customId,
		count: 0
	};

	if (user.subscriptions && user.subscriptions.length > 0 && user.subscriptions[0].customId) {
		subscriptionsResponse.count = user.subscriptions.length;
		subscriptionsResponse.subscriptions = _.map(user.subscriptions, subscription => companyResponse(companyResponse));
	}

	return subscriptionsResponse;
};
