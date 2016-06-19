'use strict';

const ValidationGenerator = require('validatron');
const userResponse = require('../models/response/userResponse');

const BaseController = require('./baseController');
const RequestService = require('../services/requestService');
const RedisService = require('../services/redisService');

const tokenUtils = require('../utils/tokenUtils');
const socialRequestUtils = require('../utils/socialRequestUtils');
const TokenInfo = require('../config/methods');


class AuthorizationController extends BaseController {
	constructor(userManager) {
		super({ userManager });
	}

	_onBind() {
		super._onBind();
		this.verify = this.verify.bind(this);
		this.verifyToken = this.verifyToken.bind(this);
		this.refreshToken = this.refreshToken.bind(this);
		this.googleVerify = this.googleVerify.bind(this);
		this.facebookVerify = this.facebookVerify.bind(this);
		this.twitterVerify = this.twitterVerify.bind(this);
	}

	_onCreate() {
		socialRequestUtils.init();
		this.authorizationClient = RedisService.getClientByName('authorizations');
		this.validationService = ValidationGenerator.createValidator({});
	}

	verifyToken(req, res, next) {
		const token = req.params.token;

		this
			.authorizationClient
			.get(token)
			.then(userId => {
				if (!userId) return this.success(res, false);
				this.success(res, true);
			})
			.catch(() => next('UNKNOWN_ERROR'));
	}

	refreshToken(req, res, next) {
		const token = req.params.token;
		let refreshToken = null;

		this
			.authorizationClient
			.get(token)
			.then(userId => {
				if (!userId) return next('UNAUTHORIZED');
				return userId;
			})
			.then(userId => tokenUtils.createToken(this.authorizationClient, userId))
			.then(refresh => {
				refreshToken = refresh;
				return this.authorizationClient.remove(token);
			})
			.then(() => this.success(res, { refreshToken }))
			.catch(() => next('UNKNOWN_ERROR'));
	}

	googleVerify(req, res) {
		const data = req.body;
		if (this.verify(data, 'tokenId')) this.error(res, 'Malformed');

		let userModel = null;

		RequestService
			.get(TokenInfo.google, { id_token: data.tokenId })
			.then(this.userManager.googleCheckExistence)
			.then(user => {
				userModel = user;
				return userModel;
			})
			.then(user => tokenUtils.createToken(this.authorizationClient, user.customId))
			.then(token => {
				userModel.token = token;
				return userModel;
			})
			.then(user => userResponse(user))
			.then(response => this.success(res, response))
			.catch(error => this.error(res, error));
	}

	facebookVerify(req, res) {
		const data = req.body;
		if (this.verify(data, 'accessToken')) this.error(res, 'Malformed');

		let userModel = null;

		RequestService
			.get(TokenInfo.facebook, { access_token: data.accessToken })
			.then(this.userManager.facebookCheckExistence)
			.then(user => {
				userModel = user;
				return userModel;
			})
			.then(user => tokenUtils.createToken(this.authorizationClient, user.customId))
			.then(token => {
				userModel.token = token;
				return userModel;
			})
			.then(user => userResponse(user))
			.then(response => this.success(res, response))
			.catch(error => this.error(res, error));
	}

	twitterVerify(req, res) {
		const data = req.body;
		if (this.verify(data, 'secret') || this.verify(data, 'token')) this.error(res, 'Malformed');

		console.log(data);
		let userModel = null;

		socialRequestUtils
			.getTwitter(data.token, data.secret)
			.then(this.userManager.twitterCheckExistence)
			.then(user => {
				console.log(user);
				userModel = user;
				return userModel;
			})
			.then(user => tokenUtils.createToken(this.authorizationClient, user.customId))
			.then(token => {
				userModel.token = token;
				return userModel;
			})
			.then(user => userResponse(user))
			.then(response => this.success(res, response))
			.catch(error => this.error(res, error));
	}

	verify(data, field) {
		return this.validationService.init(data).add(field).should.exist().and.have.type('String').validate();
	}
}

module.exports = AuthorizationController;
