'use strict';

const RedisService = require('../../services/redisService');

class AuthorizationMiddleware {
	constructor() {
		this.authorizationClient = RedisService.getClientByName('authorizations');
		this.authorize = this.authorize.bind(this);
	}

	authorize(req, res, next) {
		const accessToken = req.query.accessToken || req.body.accessToken;
		if (!accessToken) return next('UNAUTHORIZED');

		this
			.authorizationClient
			.get(accessToken)
			.then(userId => {
				if (!userId) return next('UNAUTHORIZED');
				req.userId = userId;
				return next();
			})
			.catch(next);
	}
}

module.exports = AuthorizationMiddleware;
