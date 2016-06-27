'use strict';

const AppUnit = require('../../app/unit');
const RedisService = require('../../services/redisService');

class AuthorizationMiddleware extends AppUnit {
	_onBind() {
		this.authorize = this.authorize.bind(this);
	}

	_onCreate() {
		this.authorizationClient = RedisService.getClientByName('authorizations');
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
			.catch(() => next('INTERNAL_SERVER_ERROR'));
	}
}

module.exports = AuthorizationMiddleware;
