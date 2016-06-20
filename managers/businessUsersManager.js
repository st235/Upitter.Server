'use strict';

const _ = require('underscore');
const AppUnit = require('../app/unit');

class BusinessUsersManager extends AppUnit {
	constructor(businessUsersModel) {
		super({ businessUsersModel });
	}

	_onBind() {
		this.create = this.create.bind(this);
		this.checkIfExists = this.checkIfExists.bind(this);
	}

	create(data) {
		const businessUser = new this.businessUsersModel(data);
		return businessUser.save();
	}

	checkIfExists(phone) {
		return this
			.businessUsersModel
			.findOne({ 'phone.fullNumber': phone })
			.exec()
			.then(user => {
				if (user) throw new Error('Can\'t create user. User already exists');
			});
	}
}

module.exports = BusinessUsersManager;
