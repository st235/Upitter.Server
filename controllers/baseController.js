'use strict';

const AppUnit = require('../app/unit');
const domainConfig = require('../config/domain');
const ValidationService = require('../services/validationService');

class BaseController extends AppUnit {
	_onBind() {
		this.error = this.error.bind(this);
		this.publish = this.publish.bind(this);
		this.success = this.success.bind(this);
		this.unsuccess = this.unsuccess.bind(this);
		this.responseModel = this.responseModel.bind(this);
		this.redirectToMain = this.redirectToMain.bind(this);
	}

	_onCreate() {
		this.validationService = ValidationService;
	}

	redirectToMain(res) {
		res.redirect(domainConfig.baseUrl);
	}

	error(res, error) {
		res.json(this.responseModel(false, null, error, true));
	}

	publish(res, status, obj) {
		res.status(status);
		res.json(obj);
	}

	success(res, obj) {
		res.status(200);
		res.json(this.responseModel(true, obj));
	}

	unsuccess(res, obj) {
		res.status(200);
		res.json(this.responseModel(false, obj));
	}

	responseModel(success, response, message, isError = false) {
		if (isError) return { success, error: { message }};
		return { success, response };
	}

	validate(req) {
		return this.validationService.init(req.query, req.params, req.body);
	}
}

module.exports = BaseController;
