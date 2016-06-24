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
		return businessUser.save().catch(() => {
			throw 'INTERNAL_SERVER_ERROR';
		});
	}

	checkIfExists(phone) {
		return this
			.businessUsersModel
			.findOne({ 'phone.fullNumber': phone })
			.exec()
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	edit(userId, data) {
		return this
			.businessUsersModel
			.findOne({ customId: userId })
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			})
			.then(businessUser => {
				if (!businessUser) throw 'INTERNAL_SERVER_ERROR';
				_.extend(businessUser, data);
				return businessUser.save();
			})
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			})
			.then(businessUser => businessUserResponse(businessUser));
	}
}

module.exports = BusinessUsersManager;
