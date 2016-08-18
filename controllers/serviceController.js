'use strict';

const BaseController = require('./baseController');

const ValidationUtils = require('../utils/validationUtils');
const RedisService = require('../services/redisService');

const socialConfig = require('../config/social');

class GeneralController extends BaseController {
	_onBind() {
		super._onBind();
		this.getVersionInfo = this.getVersionInfo.bind(this);
		this.setVersionInfo = this.setVersionInfo.bind(this);
	}

	_onCreate() {
		super._onCreate();
		this.validationUtils = new ValidationUtils;
		this.versionsClient = RedisService.getClientByName('versions');
	}

	getVersionInfo(req, res, next) {
		this.versionsClient.get('currentVersion').then(version => {
			this.success(res, JSON.parse(version));
		}).catch(err => next('INTERNAL_SERVER_ERROR'));
	}

	setVersionInfo(req, res, next) {
		const invalid = this.validate(req)
			.add('version').should.exist().and.have.type('Number')
			.add('code').should.exist().and.have.type('Number')
			.validate();

		if (invalid) return next(invalid.name);

		if (req.userId !== 0) return next('ACCESS_DENIED');
		const { version, code } = req.body;

		this.versionsClient.set('currentVersion', JSON.stringify({version, code})).then(() => {
			return this.success(res, true);
		}).catch(err => next('INTERNAL_SERVER_ERROR'));
	}

}

module.exports = GeneralController;
