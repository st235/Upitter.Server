'use strict';

const countryCodesConfig = require('../config/countryCodes');

// SMSProviderStrategies
const sms16 = require('./smsProviders/sms16Strategy');

class SMSService {
	static init(providers) {
		return new this(providers);
	}

	constructor(providers) {
		this.providers = providers;
		this.currentCode = null;
		this.currentNumber = null;
		this.currentText = null;
	}

	setEnv(env) {
		this.env = env;
	}

	addCode(code) {
		this.currentCode = code;
		return this;
	}

	addNumber(number) {
		this.currentNumber = number;
		return this;
	}

	addText(text) {
		this.currentText = text;
		return this;
	}

	_getValidProvider(code) {
		const providerName = countryCodesConfig[code];
		return this.providers[providerName];
	}

	_isCodeValid() {
		return /^[0-9]{1,8}$/.test(this.currentCode.toString());
	}

	_isNumberValid() {
		return /^[0-9]+$/.test(this.currentNumber.toString());
	}

	_clear() {
		this.currentCode = null;
		this.currentNumber = null;
		this.currentText = null;
	}

	sendSMS() {
		//  TODO: Обработка ошибок
		return new Promise((resolve, reject) => {
			if (this.env !== 'prod') {
				console.log(this.currentText);
				return resolve(this.currentText);
			}
			if (!this._isNumberValid()) return reject('SMS_SERVICE_ERROR');
			if (!this._isCodeValid()) return reject('SMS_SERVICE_ERROR');
			const Provider = this._getValidProvider(this.currentCode);
			if (!Provider) return reject('SMS_SERVICE_ERROR');

			const provider = Provider.init(
				this.currentCode,
				this.currentNumber,
				this.currentText
			);

			this._clear();
			return provider.sendSMS();
		});
	}
}

module.exports = SMSService.init({
	sms16
});
