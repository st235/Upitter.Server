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
		this.checkArray = this.checkArray.bind(this);
		this.checkArrayElement = this.checkArrayElement.bind(this);
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

	checkArray(arr, minLenght, maxLenght) {
		return (arr.length && arr.length > minLenght && arr.length < maxLenght) && this.checkArrayElement(arr, 1, 100);
	}

	checkArrayElement(arr, minLenght, maxLenght) {
		const boolArr = _.map(arr, (num) => typeof num.value === 'string' && num.value.length > minLenght && num.value.length < maxLenght);
		return _.indexOf(boolArr, false) === -1;
	}
}

module.exports = ValidationUtils;
