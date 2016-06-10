'use strict';

const { mixedLogger } = require('../utils/loggerUtils');
const domainConfig = require('../config/domain');

class BaseController {
	constructor() {
		this.error = this.error.bind(this);
		this.publish = this.publish.bind(this);
		this.success = this.success.bind(this);
		this.responseModel = this.responseModel.bind(this);
		this.redirectToMain = this.redirectToMain.bind(this);
	}

	redirectToMain(res) {
		res.redirect(domainConfig.baseUrl);
	}

	error(res, error) {
		mixedLogger.info('The server give back an error:', error);
		res.status(500);
		res.json(this.responseModel(false, error));
	}

	publish(res, status, obj) {
		res.status(status);
		res.json(obj);
	}

	success(res, obj) {
		mixedLogger.info('The server give back an success');
		res.status(200);
		res.json(this.responseModel(true, obj));
	}

	responseModel(success, response) {
		return { success, response };
	}
}

module.exports = BaseController;
