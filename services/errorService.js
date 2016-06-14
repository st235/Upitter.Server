'use strict';

const { LocaleBuilder } = require('default-locale');
const errorConfig = require('../config/errors');
const errorList = require('../resources/errors/errors');


class ErrorService {
	static init() {
		this.staticLocale = new LocaleBuilder(errorConfig);
	}

	static getError(innerCode, locale) {
		const errorBody = errorList[innerCode];
		const description = this.staticLocale.getString(innerCode, locale);
		return this._obtainModel(errorBody.isLog, errorBody, description);
	}

	static _obtainModel(isLog = false, errorBody, description) {
		return {
			isLog,
			innerCode: errorBody.INNER_CODE,
			externalCode: errorBody.EXTERNAL_CODE,
			description
		};
	}
}

module.exports = ErrorService;
