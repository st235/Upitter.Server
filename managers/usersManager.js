'use strict';

const _ = require('underscore');
const AppUnit = require('../app/unit');

class UsersManager extends AppUnit {
	constructor(usersModel) {
		super({ usersModel });
	}

	_onBind() {
		this.checkSocialExistence = this.checkSocialExistence.bind(this);
		this.create = this.create.bind(this);
		this.edit = this.edit.bind(this);
		this.addCompanyToSubscriptions = this.addCompanyToSubscriptions.bind(this);
		this.removeCompanyFromSubscriptions = this.removeCompanyFromSubscriptions.bind(this);
		this.getSubscriptionIds = this.getSubscriptionIds.bind(this);
	}
	
	_formSocialData(type, data) {
		let result = {
			createdDate: Date.now()
		};

		switch (type) {
			case 'google':
				result.picture = data.picture;
				result.nickname = data.name;
				result.socialId = `google_${data.email}`;
				break;
			case 'facebook':
				result.nickname = data.name;
				result.socialId = `facebook_${data.id}`;
				break;
			case 'twitter':
				result.nickname = data.name;
				result.socialId = `twitter_${data.id}`;
				break;
		}

		return result;
	}

	_findBySocialId(userData) {
		return this
			.usersModel
			.findOne({ socialId: userData.socialId })
			.exec()
			.then(user => !user ? this.create(userData) : user)
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	checkSocialExistence(type, data) {
		return this._findBySocialId(this._formSocialData(type, data));
	}

	create(data) {
		const user = new this.usersModel(data);
		return user
			.save()
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	edit(customId, data) {
		return this
			.usersModel
			.findOne({ customId })
			.then(user => {
				if (!user) throw 'INTERNAL_SERVER_ERROR';
				_.extend(user, data);
				return user.save();
			}).catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	addCompanyToSubscriptions(userId, companyId) {
		return this
			.usersModel
			.findOne({ customId: userId })
			.then(user => {
				if (!user) throw new Error(500);
				if (_.indexOf(user.subscriptions, companyId) !== -1) throw new Error('You are already subscribed to this organization');
				user.subscriptions.push(companyId);
				return user.save();
			});
	}

	removeCompanyFromSubscriptions(userId, companyId) {
		return this
			.usersModel
			.findOne({ customId: userId })
			.then(user => {
				if (!user) throw new Error(500);
				if (_.indexOf(user.subscriptions, companyId) === -1) throw new Error('You are not subscribed to this company');
				user.subscriptions = _.without(user.subscriptions, companyId);
				return user.save();
			});
	}

	getSubscriptionIds(userId) {
		return this
			.usersModel
			.findOne({ customId: userId })
			.exec();
	}
}

module.exports = UsersManager;
