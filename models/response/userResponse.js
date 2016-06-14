'use strict';

module.exports = user => {
	const userResponse = {
		customId: user.customId,
		name: user.name
	};

	if (user.picture) userResponse.picture = user.picture;
	if (user.token) userResponse.accessToken = user.token;

	return userResponse;
};
