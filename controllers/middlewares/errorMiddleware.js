'use strict';

const BaseController = require('../baseController');
const ErrorService = require('../../services/errorService');
const { mixedLogger } = require('../../utils/loggerUtils');

class ErrorMiddleware extends BaseController {
	_onBind() {
		super._onBind();

		this.obtainError = this.obtainError.bind(this);
		this.handleError = this.handleError.bind(this);
	}

	obtainError(errorCode, req, res, next) {
		const error = ErrorService.getError(errorCode, req.ln);
		if (error.TO_LOG) mixedLogger.error(error);
		res.status(error.externalCode);
		next({
			code: error.innerCode,
			message: error.description.externalDescription
		});
	}

	handleError(error, req, res, next) {
		this.error(res, error);
	}
}

module.exports = ErrorMiddleware;
