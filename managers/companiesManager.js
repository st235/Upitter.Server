'use strict';

const _ = require('underscore');

const AppUnit = require('../app/unit');
const businessUserResponse = require('../models/response/companyResponseModel');

class CompaniesManager extends AppUnit {
	constructor(companyModel) {
		super({ companyModel });
	}

	_onBind() {
		this.create = this.create.bind(this);
		this.checkIfExists = this.checkIfExists.bind(this);
		this.edit = this.edit.bind(this);
		this.getObjectId = this.getObjectId.bind(this);
		this.addUserToSubscribers = this.addUserToSubscribers.bind(this);
		this.removeUserFromSubscribers = this.removeUserFromSubscribers.bind(this);
		this.getSubscribers = this.getSubscribers.bind(this);
	}

	//  TODO: переделать
	create(data) {
		const businessUser = new this.companyModel(data);
		return businessUser.save().catch(() => {
			throw 'INTERNAL_SERVER_ERROR';
		});
	}

	checkIfExists(phone) {
		return this
			.companyModel
			.findOne({ 'phone.fullNumber': phone })
			.exec()
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	edit(userId, data) {
		return this
			.companyModel
			.findOne({ customId: userId })
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			})
			.then(businessUser => {
				if (!businessUser) throw 'INTERNAL_SERVER_ERROR';
				let validatedData = _.omit(data, 'customId', 'isVerify', 'phone', 'coordinates', 'activity', 'createdDate');
				_.extend(businessUser, validatedData);
				return businessUser.save();
			})
			.then(businessUser => businessUserResponse(businessUser));
	}

	getObjectId(companyId) {
		return this
			.companyModel
			.findOne({ customId: companyId })
			.exec()
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			})
			.then(company => company._id);
	}

	addUserToSubscribers(userId, companyId) {
		return this
			.companyModel
			.findOne({ customId: companyId })
			.exec()
			.then(company => {
				if (_.indexOf(company.subscribers, userId.toString()) !== -1) throw 'SUBSCRIBE_ERROR_1';
				company.subscribers.push(userId.toString());
				return company.save();
			})
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	removeUserFromSubscribers(userId, companyId) {
		return this
			.companyModel
			.findOne({ customId: companyId })
			.exec()
			.then(company => {
				if (_.indexOf(company.subscribers, userId.toString()) === -1) throw 'SUBSCRIBE_ERROR_2';
				company.subscribers = _.without(company.subscribers, userId.toString());
				return company.save();
			})
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	getSubscribers(companyId) {
		return this
			.companyModel
			.findOne({ customId: companyId })
			.populate('subscribers')
			.exec()
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}
}

module.exports = CompaniesManager;
