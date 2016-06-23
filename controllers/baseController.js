'use strict';

const AppUnit = require('../app/unit');
const domainConfig = require('../config/domain');

class BaseController extends AppUnit {
	_onBind() {
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
		error = error.message ? error.message : error;
		res.json(this.responseModel(false, error, true));
	}

	publish(res, status, obj) {
		res.status(status);
		res.json(obj);
	}

	success(res, obj) {
		res.status(200);
		res.json(this.responseModel(true, obj));
	}

	responseModel(success, message, isError = false) {
		if (isError) return { success, error: { message } };
		return { success, message };
	}
}

module.exports = BaseController;
