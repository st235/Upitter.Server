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
		this.addUserToSubscribers = this.addUserToSubscribers.bind(this);
		this.removeUserFromSubscribers = this.removeUserFromSubscribers.bind(this);
		this.asd = this.asd.bind(this);
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

	addUserToSubscribers(userId, companyId) {
		return this
			.businessUsersModel
			.findOne({ customId: companyId })
			.then(company => {
				if (!company) throw new Error(500);
				if (_.indexOf(company.subscribers, userId) !== -1) throw new Error('You are already subscribed to this organization');
				company.subscribers.push(userId);
				return company.save();
			});
	}

	removeUserFromSubscribers(userId, companyId) {
		return this
			.businessUsersModel
			.findOne({ customId: companyId })
			.then(company => {
				if (!company) throw new Error(500);
				if (_.indexOf(company.subscribers, userId) === -1) throw new Error('You are not subscribed to this company');
				company.subscribers = _.without(company.subscribers, String(userId));
				return company.save();
			});
	}

	asd(ids) {
		return _.map(ids, (id) => {
			return this
				.businessUsersModel
				.findOne({ customId: id });
		});
	}

}

module.exports = BusinessUsersManager;
