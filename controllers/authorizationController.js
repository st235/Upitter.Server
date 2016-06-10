'use strict';

const BaseController = require('./baseController');
const RequestService = require('../services/requestService');

const { GOOGLE_TOKEN_INFO } = require('../config/methods');

class AuthorizationController extends BaseController {
	constructor(authorizationManager, userManager) {
		super();
		this.authorizationManager = authorizationManager;
		this.userManager = userManager;

		this.googleVerify = this.googleVerify.bind(this);
	}

	googleVerify(req, res) {
		RequestService
			.get(GOOGLE_TOKEN_INFO, { id_token: req.body.tokenId })
			.then(googleResponse =>
				this.userManager.checkExistence(googleResponse)
					.then(result => this.success(res, result))
			.catch(error => this.error(res, error)));

	}
}

module.exports = AuthorizationController;
