'use strict';

const BaseController = require('./baseController');
const ValidationUtils = require('../utils/validationUtils');

const socialConfig = require('../config/social');

class GeneralController extends BaseController {
	_onBind() {
		super._onBind();
		this.getSocialInfo = this.getSocialInfo.bind(this);
	}

	_onCreate() {
		super._onCreate();
		this.validationUtils = new ValidationUtils;
	}

	getSocialInfo(req, res) {
		return this.success(res, socialConfig);
	}

}

module.exports = GeneralController;
