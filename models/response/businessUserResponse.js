'use strict';

module.exports = businessUser => {
	const businessUserResponse = {
		customId: businessUser.customId,
		activity: businessUser.activity,
		name: businessUser.name,
		isVerify: businessUser.isVerify,
		subscribers: businessUser.subscribers,
		moderatorsList: businessUser.moderatorsList,
		addressesList: businessUser.addressesList
	};

	if (businessUser.description) businessUserResponse.description = businessUser.description;
	if (businessUser.logoUrl) businessUserResponse.logoUrl = businessUser.logoUrl;
	return businessUserResponse;
};
