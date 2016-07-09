'use strict';

const _ = require('underscore');
const AppUnit = require('../app/unit');

class UsersManager extends AppUnit {
	constructor(userModel) {
		super({ userModel });
	}

	_onBind() {
		this.checkSocialExistence = this.checkSocialExistence.bind(this);
		this.create = this.create.bind(this);
		this.edit = this.edit.bind(this);
		this.getObjectId = this.getObjectId.bind(this);
		this.addCompanyToSubscriptions = this.addCompanyToSubscriptions.bind(this);
		this.removeCompanyFromSubscriptions = this.removeCompanyFromSubscriptions.bind(this);
		this.getSubscriptions = this.getSubscriptions.bind(this);
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
			.userModel
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
		const user = new this.userModel(data);
		return user
			.save()
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	edit(customId, data) {
		return this
			.userModel
			.findOne({ customId })
			.exec()
			.then(user => {
				if (!user) throw 'INTERNAL_SERVER_ERROR';
				let validatedData = _.omit(data, 'customId', 'isVerify', 'createdDate', 'socialId');
				_.extend(user, validatedData);
				return user.save();
			}).catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	getObjectId(userId) {
		return this
			.userModel
			.findOne({ customId: userId })
			.exec()
			.then(user => user._id);
	}

	addCompanyToSubscriptions(userId, companyId) {
		return this
			.userModel
			.findOne({ customId: userId })
			.exec()
			.then(user => {
				if (!user) throw new Error(500);
				if (_.indexOf(user.subscriptions, companyId.toString()) !== -1) throw 'SUBSCRIBE_ERROR_1';
				user.subscriptions.push(companyId.toString());
				return user.save();
			})
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	removeCompanyFromSubscriptions(userId, companyId) {
		return this
			.userModel
			.findOne({ customId: userId })
			.exec()
			.then(user => {
				if (!user) throw new Error(500);
				if (_.indexOf(user.subscriptions, companyId.toString()) === -1) throw 'SUBSCRIBE_ERROR_2';
				user.subscriptions = _.without(user.subscriptions, companyId.toString());
				return user.save();
			})
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	getSubscriptions(userId) {
		return this
			.userModel
			.findOne({ customId: userId })
			.populate('subscriptions')
			.exec()
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}
}

module.exports = UsersManager;
