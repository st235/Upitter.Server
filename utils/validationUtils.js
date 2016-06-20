'use strict';

const ValidationService = require('../services/validationService');

class ValidationUtils {
	constructor() {
		this.validationService = ValidationService;
		this.stringVerify = this.stringVerify.bind(this);
	}

	stringVerify(data, field) {
		return this.validationService.init(data).add(field).should.exist().and.have.type('String').validate();
	}
}

module.exports = ValidationUtils;
