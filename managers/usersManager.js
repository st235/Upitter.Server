'use strict';

const _ = require('underscore');
const AppUnit = require('../app/unit');

class UsersManager extends AppUnit {
	constructor(usersModel) {
		super({ usersModel });
	}

	_onBind() {
		this.googleCheckExistence = this.googleCheckExistence.bind(this);
		this.facebookCheckExistence = this.facebookCheckExistence.bind(this);
		this.twitterCheckExistence = this.twitterCheckExistence.bind(this);
		this.create = this.create.bind(this);
		this.edit = this.edit.bind(this);
		this.addCompanyToSubscriptions = this.addCompanyToSubscriptions.bind(this);
		this.removeCompanyFromSubscriptions = this.removeCompanyFromSubscriptions.bind(this);
		this.getSubscriptionIds = this.getSubscriptionIds.bind(this);
	}

	//TODO Объединить 3 метода в 1

	googleCheckExistence(json) {
		//TODO Добавить try catch
		const data = JSON.parse(json);
		const userData = {
			picture: data.picture,
			nickname: data.name,
			createdDate: Date.now(),
			socialId: `google_${data.email}`
		};

		return this
			.usersModel
			.findOne({ socialId: userData.socialId })
			.exec()
			.then(user => !user ? this.create(userData) : user);
	}

	facebookCheckExistence(json) {
		//TODO Добавить try catch
		const data = JSON.parse(json);
		const userData = {
			nickname: data.name,
			createdDate: Date.now(),
			socialId: `facebook_${data.id}`
		};

		return this
			.usersModel
			.findOne({ socialId: userData.socialId })
			.exec()
			.then(user => !user ? this.create(userData) : user);
	}

	twitterCheckExistence(data) {
		const userData = {
			nickname: data.name,
			createdDate: Date.now(),
			socialId: `twitter_${data.id}`
		};

		return this
			.usersModel
			.findOne({ socialId: userData.socialId })
			.exec()
			.then(user => !user ? this.create(userData) : user);
	}

	create(data) {
		const user = new this.usersModel(data);
		return user.save();
	}

	edit(userId, data) {
		return this
			.usersModel
			.findOne({ customId: userId })
			.then(user => {
				if (!user) throw new Error(500);
				_.extend(user, data);
				return user.save();
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
