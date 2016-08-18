'use strict';

const _ = require('underscore');

const AppUnit = require('../app/unit');

class CompaniesManager extends AppUnit {
	constructor(companyModel) {
		super({ companyModel });
	}

	_onBind() {
		this.findByAlias = this.findByAlias.bind(this);
		this.create = this.create.bind(this);
		this.checkIfExists = this.checkIfExists.bind(this);
		this.edit = this.edit.bind(this);
		this.findById = this.findById.bind(this);
		this.getObjectId = this.getObjectId.bind(this);
		this.toggleUserSubscription = this.toggleUserSubscription.bind(this);
		this.getSubscribers = this.getSubscribers.bind(this);
	}

	findByAlias(alias) {
		return this
			.companyModel
			.findByAlias(alias)
			.then(company => {
				if (!company) return this.companyModel.findById(alias);
				return company;
			})
			.then(company => {
				if (!company) throw 'INTERNAL_SERVER_ERROR';
				return company;
			});
	}

	//  TODO: переделать
	create(data) {
		const businessUser = new this.companyModel(data);
		return businessUser
			.save()
			.catch((e) => {
				console.log(e);
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

	edit(customId, companyInfo) {
		const data = _.omit(companyInfo, field => _.isUndefined(field));

		//TODO: Добавить проверку по соц сетям
		return this
			.companyModel
			.findOneAndUpdate({ customId }, data, { new: true })
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	findById(companyId) {
		return this
			.companyModel
			.findOne({ customId: companyId })
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
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

	toggleUserSubscription(userId, customId) {
		return this
			.companyModel
			.findOne({ customId })
			.exec()
			.then(company => {
				if (!company) throw 'INTERNAL SERVER ERROR';

				const userIdString = userId.toString();
				if (_.indexOf(company.subscribers, userIdString) !== -1) {
					company.subscribers = _.without(company.subscribers, userIdString);
				} else {
					company.subscribers.push(userIdString);
				}
				return company.save();
			})
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	getSubscribers(customId) {
		return this
			.companyModel
			.findOne({ customId })
			.populate('subscribers')
			.exec()
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}
}

module.exports = CompaniesManager;
