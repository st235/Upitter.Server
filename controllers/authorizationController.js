'use strict';

const userResponse = require('../models/response/userResponse');

const BaseController = require('./baseController');
const ValidationService = require('../services/validationService');
const RequestService = require('../services/requestService');
const RedisService = require('../services/redisService');
const SMSService = require('../services/smsService');

const authUtils = require('../utils/authUtils');
const secretUtils = require('../utils/secretUtils');
const socialRequestUtils = require('../utils/socialRequestUtils');
const TokenInfo = require('../config/methods');


class AuthorizationController extends BaseController {
	constructor(userManager, businessUserManager) {
		super();
		socialRequestUtils.init();
		this.authorizationClient = RedisService.getClientByName('authorizations');
		this.validationService = ValidationService;

		this.userManager = userManager;
		this.businessUserManager = businessUserManager;

		this.verify = this.verify.bind(this);
		this.verifyToken = this.verifyToken.bind(this);
		this.refreshToken = this.refreshToken.bind(this);
		this.googleVerify = this.googleVerify.bind(this);
		this.facebookVerify = this.facebookVerify.bind(this);
		this.twitterVerify = this.twitterVerify.bind(this);

		this.authorizeByPhone = this.authorizeByPhone.bind(this);
		this.verifyCode = this.verifyCode.bind(this);
		this.addInfo = this.addInfo.bind(this);
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
			.then(userId => authUtils.createToken(this.authorizationClient, userId))
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
			.then(user => authUtils.createToken(this.authorizationClient, user.customId))
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
			.then(user => authUtils.createToken(this.authorizationClient, user.customId))
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

		let userModel = null;

		socialRequestUtils
			.getTwitter(data.token, data.secret)
			.then(this.userManager.twitterCheckExistence)
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
			.catch(error => this.error(res, error));
	}

	authorizeByPhone(req, res) {
		const invalid = this.validationService
			.init(req.body, req.query, req.params)
			.add('number').should.exist().and.have.type('String').and.be.in.rangeOf(5, 20)
			.add('countryCode').should.exist().and.have.type('String').and.be.in.rangeOf(1, 8)
			.validate();

		if (invalid) return this.error(res, invalid);
		
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
			.catch(error => this.error(res, error));
	}

	verifyCode(req, res) {
		const invalid = this.validationService
			.init(req.body, req.query, req.params)
			.add('number').should.exist().and.have.type('String').and.be.in.rangeOf(5, 20)
			.add('countryCode').should.exist().and.have.type('String').and.be.in.rangeOf(1, 8)
			.add('code').should.exist().and.have.type('Number')
			.validate();
		
		if (invalid) return this.error(res, invalid);
		
		const { number, countryCode } = req.params;
		const phone = `${countryCode}${number}`;
		const { code } = req.body;

		//TODO: Обработка ошибок!
		authUtils.getOrgTempModel(this.authorizationClient, phone)
			.then(model => {
				if (!model) return this.error(res, 'No such phone in database');
				if (!model.code) return this.error(res, 'Code was not yet sent');
				//TODO: Добавить число попыток в конфиг
				if (model.attempts > 3) return this.error(res, 'Number of attempts exceeded');
				if (model.code !== code) {
					model.attempts++;
					return authUtils.setOrgTempModel(this.authorizationClient, phone, model)
						.then(model => this.error(res, {attempts: model.attempts}));
				}
				model.temporaryToken = secretUtils.getUniqueHash(phone);
				model.code = null;
				model.attempts = null;
				return authUtils.setOrgTempModel(this.authorizationClient, phone, model)
					.then(model => this.success(res, { temporaryToken }));

			})
			.catch(error => this.error(res, error));
	}

	addInfo(req, res) {
		//TODO: Добавить в валидатрон метод length с четким указанием длинны
		const invalid = this.validationService
			.init(req.body, req.query, req.params)
			.add('number').should.exist().and.have.type('String').and.be.in.rangeOf(5, 20)
			.add('countryCode').should.exist().and.have.type('String').and.be.in.rangeOf(1, 8)
			.add('temporaryToken').should.exist().and.have.type('String')
			.add('name').should.exist().and.have.type('Number').and.be.in.rangeOf(2, 25)
			.add('coord').should.exist().and.have.type('Array').and.be.in.rangeOf(2, 2)
			.add('category').should.exist().and.have.type('String').and.be.in.rangeOf(3, 20)
			.validate();

		if (invalid) return this.error(res, invalid);

		const { number, countryCode } = req.params;
		const phone = `${countryCode}${number}`;
		const { temporaryToken, name, coord, category } = req.body;

		authUtils.getOrgTempModel(this.authorizationClient, phone)
			.then(model => {
				if (!model) return this.error(res, 'No such user in database');
				//TODO: Добавить число попыток в конфиг
				//TODO: Обработка ошибок
				if (!model.temporaryToken) return this.error(res, 'No temporary token was given to you');
				if (model.temporaryToken !== temporaryToken) return this.error(res, 'Supplied token is invalid');

				return this.businessUserManager.checkIfExists(phone)
					.then(this.businessUserManager.create({
						//TODO: проверка категории на существование в нашем списке
						name,
						activity: category,
						phone: {
							body: number,
							code: countryCode,
							fullNumber: phone
						}
					}));
			})
			.catch(error => this.error(res, error));
	}

	verify(data, field) {
		return this.validationService.init(data).add(field).should.exist().and.have.type('String').validate();
	}
}

module.exports = AuthorizationController;
