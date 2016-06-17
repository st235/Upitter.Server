'use strict';

const countryCodesConfig = require('../config/countryCodes');

// SMSProviderStrategies
const sms16  = require('smsProviders/sms16Strategy');

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
	
	_isCodeValid(code) {
		return '/^[0-9]{1, 8}$/'.test(code.toString());
	}

	_isNumberValid(number) {
		return '/^[0-9]+$/'.test(code.toString());
	}

	_clear() {
		this.currentNumberOptions = null;
		this.currentCode = null;
		this.currentNumber = null;
	}

	sendSMS() {
		//TODO: Обработка ошибок
		return new Promise((resolve, reject) => {
			if (!this._isNumberValid()) return reject(new Error('Invalid number'));
			const Provider = this._getValidProvider(this.currentNumberOptions.code);
			if (!provider) return reject(new Error('Country code is not supported'));
			
			const provider = Provider.init(
				this.currentCode,
				this.currentNumber,
				this.currentText
			);
			
			
		});

	}
}

module.exports = SMSService.init({
	sms16
});
