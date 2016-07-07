'use strict';

const userResponse = require('../models/response/userResponse');
const businessUserResponse = require('../models/response/businessUserResponse');

const BaseController = require('./baseController');
const ValidationService = require('../services/validationService');
const RedisService = require('../services/redisService');
const SMSService = require('../services/smsService');

const authUtils = require('../utils/authUtils');
const secretUtils = require('../utils/secretUtils');
const socialRequestUtils = require('../utils/socialRequestUtils');
const TokenInfo = require('../config/methods');


class AuthorizationController extends BaseController {
	constructor(userManager, businessUserManager) {
		super({ userManager, businessUserManager });
	}

	_onBind() {
		super._onBind();
		this.verifyToken = this.verifyToken.bind(this);
		this.refreshToken = this.refreshToken.bind(this);
		this.googleVerify = this.googleVerify.bind(this);
		this.facebookVerify = this.facebookVerify.bind(this);
		this.twitterVerify = this.twitterVerify.bind(this);

		this.authorizeByPhone = this.authorizeByPhone.bind(this);
		this.verifyCode = this.verifyCode.bind(this);
		this.addInfo = this.addInfo.bind(this);
	}

	_onCreate() {
		super._onCreate();
		socialRequestUtils.init();
		this.authorizationClient = RedisService.getClientByName('authorizations');
		this.validationService = ValidationService;
	}

	verifyToken(req, res, next) {
		const invalid = this.validate(req)
			.add('token').should.exist().and.have.type('String')
			.validate();

		if (invalid) return next(invalid.name);

		const token = req.params.token;

		this
			.authorizationClient
			.get(token)
			.then(userId => userId ? this.success(res, true) : this.success(res, false))
			.catch(() => next('UNAUTHORIZED'));
	}

	refreshToken(req, res, next) {
		const invalid = this.validate(req)
			.add('token').should.exist().and.have.type('String')
			.validate();

		if (invalid) return next(invalid.name);

		const token = req.params.token;
		let refreshToken = null;

		this
			.authorizationClient
			.get(token)
			.then(userId => {
				if (userId) return userId;
				throw 'UNAUTHORIZED';
			})
			.then(userId => authUtils.createToken(this.authorizationClient, userId))
			.then(refresh => {
				refreshToken = refresh;
				return this.authorizationClient.remove(token);
			})
			.then(() => this.success(res, { refreshToken }))
			.catch(next);
	}

	googleVerify(req, res, next) {
		const invalid = this.validate(req)
			.add('tokenId').should.exist().and.have.type('String')
			.validate();

		if (invalid) return next(invalid.name);

		const id_token = req.body.tokenId;
		let userModel = null;

		socialRequestUtils
			.getGoogle(TokenInfo.google, { id_token })
			.then(response => this.userManager.checkSocialExistence('google', response))
			.then(user => {
				userModel = user;
				return userModel;
			})
			.then(user => authUtils.createToken(this.authorizationClient, user.customId))
			.then(token => {
				userModel.token = token;
				return userModel;
			})
			.then(user => userResponse(user))
			.then(response => this.success(res, response))
			.catch(next);
	}

	facebookVerify(req, res, next) {
		const invalid = this.validate(req)
			.add('accessToken').should.exist().and.have.type('String')
			.validate();

		if (invalid) return next(invalid.name);

		const { accessToken } = req.body;
		let userModel = null;

		socialRequestUtils
			.getFacebook(TokenInfo.facebook, { access_token: accessToken })
			.then(response => this.userManager.checkSocialExistence('facebook', response))
			.then(user => {
				userModel = user;
				return userModel;
			})
			.then(user => authUtils.createToken(this.authorizationClient, user.customId))
			.then(token => {
				userModel.token = token;
				return userModel;
			})
			.then(userResponse)
			.then(response => this.success(res, response))
			.catch(next);
	}

	twitterVerify(req, res, next) {
		const invalid = this.validate(req)
			.add('accessToken').should.exist().and.have.type('String')
			.add('token').should.exist().and.have.type('String')
			.validate();

		if (invalid) return next(invalid.name);

		const { token, secret } = req.body;

		let userModel = null;

		socialRequestUtils
			.getTwitter(token, secret)
			.then(response => this.userManager.checkSocialExistence('twitter', response))
			.then(user => {
				userModel = user;
				return userModel;
			})
			.then(user => authUtils.createToken(this.authorizationClient, user.customId))
			.then(token => {
				userModel.token = token;
				return userModel;
			})
			.then(user => userResponse(user))
			.then(response => this.success(res, response))
			.catch(next);
	}

	authorizeByPhone(req, res, next) {
		const invalid = this.validate(req)
			.add('number').should.exist().and.have.type('String').and.be.in.rangeOf(5, 20)
			.add('countryCode').should.exist().and.have.type('String').and.be.in.rangeOf(1, 8)
			.validate();

		if (invalid) return next(invalid.name);

		const { number, countryCode } = req.params;
		const phone = `${countryCode}${number}`;
		const code = secretUtils.generateCode();
		const attempts = 0;
		const tempModel = { code, number, countryCode, attempts };

		SMSService
			.addNumber(number)
			.addCode(countryCode)
			.addText(code)
			.sendSMS()
			.then(() => authUtils.setOrgTempModel(this.authorizationClient, phone, tempModel))
			.then(this.success(res))
			.catch(next);
	}

	verifyCode(req, res, next) {
		let userModel;
		const invalid = this.validate(req)
			.add('number').should.exist().and.have.type('String').and.be.in.rangeOf(5, 20)
			.add('countryCode').should.exist().and.have.type('String').and.be.in.rangeOf(1, 8)
			.add('code').should.exist().and.have.type('String')
			.validate();

		if (invalid) return next(invalid.name);

		const { number, countryCode } = req.params;
		const phone = `${countryCode}${number}`;
		const { code } = req.body;

		authUtils.getOrgTempModel(this.authorizationClient, phone)
			.then(model => {
				if (!model) throw 'PHONE_NOT_FOUND';
				if (!model.code) throw 'INTERNAL_SERVER_ERROR';
				//TODO: Добавить число попыток в конфиг
				if (model.attempts > 3) throw 'NUMBER_OF_ATTEMPTS_EXCEEDED';
				if (model.code !== code) {
					model.attempts++;
					return authUtils.setOrgTempModel(this.authorizationClient, phone, model)
						.then(model => this.unsuccess(res, { attempts: model.attempts }));
				}

				return this.businessUserManager
					.checkIfExists(phone)
					.then(user => {
						if (user) return authUtils.removeOrgTempModel(this.authorizationClient, phone)
							.then(() => {
								userModel = user;
								return authUtils.createToken(this.authorizationClient, user.customId);
							})
							.then(accessToken => {
								userModel.accessToken = accessToken;
								return businessUserResponse(userModel);
							})
							.then((businessUser) => this.success(res, {
								isAuthorized: true,
								businessUser
							}));

						model.temporaryToken = secretUtils.getUniqueHash(phone);
						model.code = null;
						model.attempts = null;
						return authUtils.setOrgTempModel(this.authorizationClient, phone, model)
							.then(model => this.success(res, {
								isAuthorized: false,
								temporaryToken: model.temporaryToken
							}));
					});
			})
			.catch(next);
	}

	addInfo(req, res, next) {
		let businessUser;
		//  TODO: Добавить в валидатрон метод length с четким указанием длинны
		//  TODO: Добавить в валидатрон метод should.be.containedBy('body'/'query'/'params')
		const invalid = this.validate(req)
			.add('number').should.exist().and.have.type('String').and.be.in.rangeOf(5, 20)
			.add('countryCode').should.exist().and.have.type('String').and.be.in.rangeOf(1, 8)
			.add('temporaryToken').should.exist().and.have.type('String')
			.add('name').should.exist().and.have.type('String').and.be.in.rangeOf(2, 25)
			//.add('site').should.have.type('String')
			.add('category').should.exist()
			.add('coordinates').should.exist()
			.validate();
		if (invalid) return next(invalid.name);

		const { number, countryCode } = req.params;
		const phone = `${countryCode}${number}`;
		const { temporaryToken, name, site, coordinates, category } = req.body;

		authUtils.getOrgTempModel(this.authorizationClient, phone)
			.then(model => {
				if (!model) throw 'PHONE_NOT_FOUND';
				//TODO: Добавить число попыток в конфиг
				//TODO: Обработка ошибок
				if (!model.temporaryToken) throw 'NO_TEMPORARY_TOKEN_IN_DB';
				if (model.temporaryToken !== temporaryToken) throw 'INVALID_TEMPORARY_TOKEN';

				return this.businessUserManager.checkIfExists(phone)
					.then(user => {
						if (!user) {
							return this.businessUserManager.create({
								//TODO: проверка категории на существование в нашем списке
								name,
								activity: category,
								site,
								coordinates,
								phone: {
									body: number,
									code: countryCode,
									fullNumber: phone
								}
							});
						}

						throw 'USER_ALREADY_EXISTS';
					});
			})
			.then(user => {
				businessUser = user;
				return authUtils.createToken(this.authorizationClient, user.customId);
			})
			.then(accessToken => {
				businessUser.accessToken = accessToken;
				return businessUser;
			})
			.then(businessUser => this.success(res, businessUserResponse(businessUser)))
			.catch(next);
	}
}

module.exports = AuthorizationController;
