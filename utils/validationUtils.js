'use strict';

const _ = require('underscore');

const AppUnit = require('../app/unit');
const ValidationService = require('../services/validationService');

class ValidationUtils extends AppUnit {
	constructor() {
		super({ validationService: ValidationService });
	}

	_onBind() {
		this.existAndTypeVerify = this.existAndTypeVerify.bind(this);
		this.typeVerify = this.typeVerify.bind(this);
	}

	existAndTypeVerify(data, type, ...fields) {
		let validation = this
			.validationService
			.init(data);

		_.each(fields, field => {
			validation
				.add(field)
				.should
				.exist()
				.and
				.have
				.type(type);
		});

		return validation.validate();
	}

	typeVerify(data, type, ...fields) {
		let validation = this
			.validationService
			.init(data);

		_.each(fields, field => {
			validation
				.add(field)
				.should
				.have
				.type(type);
		});

		return validation.validate();
	}
}

module.exports = ValidationUtils;
