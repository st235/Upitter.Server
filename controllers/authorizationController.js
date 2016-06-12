'use strict';

const BaseController = require('./baseController');
const RequestService = require('../services/requestService');
const TokenInfo = require('../config/methods');


class AuthorizationController extends BaseController {
	constructor(authorizationManager, userManager) {
		super();
		this.authorizationManager = authorizationManager;
		this.userManager = userManager;

		this.googleVerify = this.googleVerify.bind(this);
		this.facebookVerify = this.facebookVerify.bind(this);
		this.twitterVerify = this.twitterVerify.bind(this);
	}

	googleVerify(req, res) {
		RequestService
			.get(TokenInfo.google, { id_token: req.body.tokenId })
			.then(googleResponse => this.userManager.googleCheckExistence(googleResponse))
			.then(user => this.success(res, user))
			.catch(error => this.error(res, error));
	}

	facebookVerify(req, res) {
		RequestService
			.get(TokenInfo.facebook, { access_token: req.body.accessToken })
			.then(facebookResponse => this.userManager.facebookCheckExistence(facebookResponse))
			.then(user => this.success(res, user))
			.catch(error => this.error(res, error));
	}

	twitterVerify(req, res) {
		RequestService.getTwitter(req.body.token, req.body.secret)
			.then(twitterResponse => this.userManager.twitterCheckExistence(twitterResponse))
			.then(user => this.success(res, user))
			.catch(error => this.error(res, error));
	}
}

module.exports = AuthorizationController;
