'use strict';

const secretUtils = require('./secretUtils');

module.exports = {
	createToken(authorizationClient, userId) {
		const token = secretUtils.getUniqueHash(userId);

		return authorizationClient
			.set(token, userId)
			.then(() => authorizationClient.expire(token, 30000))
			.then(() => token);
	}
};
