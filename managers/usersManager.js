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
		this.favorite = this.favorite.bind(this);
		this.getObjectId = this.getObjectId.bind(this);
		this.toggleCompanySubscription = this.toggleCompanySubscription.bind(this);
		this.getSubscriptions = this.getSubscriptions.bind(this);
		this.findById = this.findById.bind(this);
		this.getFavorites = this.getFavorites.bind(this);
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
		case 'vk':
			result.nickname = data.first_name;
			result.socialId = `vk_${data.user_id}`;
			result.sex = data.sex;
			result.name = data.first_name;
			result.surname = data.last_name;
			break;
		default:
			throw 'INTERNAL_SERVER_ERROR';
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

	favorite(customId, postId) {
		return this
			.userModel
			.findOne({ customId })
			.exec()
			.then(user => {
				if (!user) throw 'INTERNAL_SERVER_ERROR';
				const postIdString = postId.toString();
				const findQuery = _.find(user.favorites, favorite => favorite === postIdString);
				if (findQuery) user.favorites = _.without(user.favorites, postIdString);
				else user.favorites.push(postIdString);
				return user.save();
			});
	}

	getObjectId(userId) {
		return this
			.userModel
			.findOne({ customId: userId })
			.exec()
			.then(user => user._id)
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	toggleCompanySubscription(userId, companyId) {
		return this
			.userModel
			.findOne({ customId: userId })
			.exec()
			.then(user => {
				if (!user) throw 'INTERNAL SERVER ERROR';
				const companyIdString = companyId.toString();
				if (_.indexOf(user.subscriptions, companyIdString) !== -1) {
					user.subscriptions = _.without(user.subscriptions, companyIdString);
				} else {
					user.subscriptions.push(companyIdString);
				}
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

	findById(userId) {
		return this
			.userModel
			.findOne({ customId: userId })
			.exec()
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	getFavorites(userId) {
		return this
			.userModel
			.findOne({ customId: userId })
			.populate('favorites')
			.exec()
			.then(user => user.favorites)
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}
}

module.exports = UsersManager;
