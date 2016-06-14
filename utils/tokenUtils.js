'use strict';

const secretUtils = require('./secretUtils');

const EXPIRE_DATE = 604800000;

module.exports = {
	createToken(authorizationClient, userId) {
		const token = secretUtils.getUniqueHash(userId);

		return authorizationClient
			.set(token, userId)
			.then(() => authorizationClient.expire(token, EXPIRE_DATE))
			.then(() => token);
	}
};
