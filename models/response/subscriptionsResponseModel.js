'use strict';

const _ = require('underscore');
const companyResponse = require('./companyResponseModel');

module.exports = (user, limit, companyId) => {
	const subscriptionsResponse = {
		customId: user.customId,
		count: 0
	};

	if (user.subscriptions && user.subscriptions.length > 0 && user.subscriptions[0].customId) {
		subscriptionsResponse.count = user.subscriptions.length;
		let index = 0;
		if (companyId) _.each(user.subscriptions, (company, i) => (company.customId === companyId) ? index = i + 1 : index);
		const subscriptions = user.subscriptions.splice(index, limit);
		subscriptionsResponse.subscriptions = _.map(subscriptions, subscription => companyResponse(subscription));
	}

	return subscriptionsResponse;
};
