'use strict';

const _ = require('underscore');
const AppUnit = require('../app/unit');

const businessUserResponse = require('../models/response/businessUserResponse');

class BusinessUsersManager extends AppUnit {
	constructor(businessUsersModel) {
		super({ businessUsersModel });
	}

	_onBind() {
		this.create = this.create.bind(this);
		this.checkIfExists = this.checkIfExists.bind(this);
		this.edit = this.edit.bind(this);
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
	}

	edit(userId, data) {
		return this
			.businessUsersModel
			.findOne({ customId: userId })
			.then(businessUser => {
				if (!businessUser) throw new Error(500);
				_.extend(businessUser, data);
				return businessUser.save();
			})
			.then(businessUser => {
				if (!businessUser) throw new Error(500);
				return businessUserResponse(businessUser);
			});
	}
}

module.exports = BusinessUsersManager;
