'use strict';

const ValidationGenerator = require('validatron');

const BaseController = require('./baseController');
const RequestService = require('../services/requestService');

const socialRequestUtils = require('../utils/socialRequestUtils');
const TokenInfo = require('../config/methods');


class AuthorizationController extends BaseController {
	constructor(authorizationManager, userManager) {
		super();
		socialRequestUtils.init();
		this.validationService = ValidationGenerator.createValidator({});

		this.authorizationManager = authorizationManager;
		this.userManager = userManager;

		this.verify = this.verify.bind(this);
		this.googleVerify = this.googleVerify.bind(this);
		this.facebookVerify = this.facebookVerify.bind(this);
		this.twitterVerify = this.twitterVerify.bind(this);
	}

	googleVerify(req, res) {
		const data = req.body;
		if (this.verify(data, 'tokenId')) this.error(res, 'Malformed');

		RequestService
			.get(TokenInfo.google, { id_token: data.tokenId })
			.then(googleResponse => this.userManager.googleCheckExistence(googleResponse))
			.then(user => this.success(res, user))
			.catch(error => this.error(res, error));
	}

	facebookVerify(req, res) {
		const data = req.body;
		if (this.verify(data, 'accessToken')) this.error(res, 'Malformed');

		RequestService
			.get(TokenInfo.facebook, { access_token: data.accessToken })
			.then(facebookResponse => this.userManager.facebookCheckExistence(facebookResponse))
			.then(user => this.success(res, user))
			.catch(error => this.error(res, error));
	}

	twitterVerify(req, res) {
		const data = req.body;
		if (this.verify(data, 'secret')) this.error(res, 'Malformed');

		socialRequestUtils
			.getTwitter(req.body.token, data.secret)
			.then(twitterResponse => this.userManager.twitterCheckExistence(twitterResponse))
			.then(user => this.success(res, user))
			.catch(error => this.error(res, error));
	}

	verify(data, field) {
		return this.validationService.init(data).add(field).should.exist().and.have.type('String').validate();
	}
}

module.exports = AuthorizationController;
