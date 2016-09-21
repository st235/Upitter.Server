'use strict';

module.exports = (company, subscribe) => {
	const subscribersResponse = {
		subscribersAmount: '0',
		subscribe
	};

	if (company.subscribers && company.subscribers.length) {
		if (company.subscribers.length < 1000) subscribersResponse.subscribersAmount = company.subscribers.length.toString();
		else if (company.subscribers.length < 1000000) subscribersResponse.subscribersAmount = Math.round(company.subscribers.length / 1000) + 'k';
		else subscribersResponse.subscribersAmount = Math.round(company.subscribers.length / 1000000) + 'M';
	}

	return subscribersResponse;
};
