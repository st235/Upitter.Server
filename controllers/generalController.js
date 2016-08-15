'use strict';

const BaseController = require('./baseController');
const ValidationUtils = require('../utils/validationUtils');

const socialConfig = require('../config/socialConfig');

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
		return res.json(socialConfig);
	}

}

module.exports = GeneralController;
