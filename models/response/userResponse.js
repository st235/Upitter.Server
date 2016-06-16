'use strict';

module.exports = user => {
	const userResponse = {
		customId: user.customId,
		nickname: user.nickname,
		isVerify: user.isVerify,
		sex: user.sex
	};

	if (user.name) userResponse.name = user.name;
	if (user.surname) userResponse.surname = user.surname;
	if (user.email) userResponse.email = user.email;
	if (user.picture) userResponse.picture = user.picture;
	if (user.subscriptions) userResponse.subscriptions = user.subscriptions;
	if (user.token) userResponse.accessToken = user.token;
	return userResponse;
};
