'use strict';

const _ = require('underscore');

class UsersManager {
	constructor(usersModel) {
		this.usersModel = usersModel;

		this.googleCheckExistence = this.googleCheckExistence.bind(this);
		this.facebookCheckExistence = this.facebookCheckExistence.bind(this);
		this.twitterCheckExistence = this.twitterCheckExistence.bind(this);
		this.create = this.create.bind(this);
		this.edit = this.edit.bind(this);
	}

	googleCheckExistence(json) {
		//TODO Добавить try catch
		const data = JSON.parse(json);
		const userData = {
			email: data.email,
			picture: data.picture,
			nickname: data.name,
			createdDate: Date.now(),
			socialId: `google_${data.email}`
		};

		return this
			.usersModel
			.findOne({ socialId: userData.socialId })
			.exec()
			.then(user => {
				if (!user && userData.email) {
					return this
						.usersModel
						.findOne({ email: userData.email }).exec()
						.then(userModel => !userModel ? this.create(userData) : userModel);
				} else {
					return user;
				}
			});
	}


	facebookCheckExistence(json) {
		//TODO Добавить try catch
		const data = JSON.parse(json);
		const userData = {
			email: data.email,
			nickname: data.name,
			createdDate: Date.now(),
			socialId: `facebook_${data.id}`
		};

		return this
			.usersModel
			.findOne({ socialId: userData.socialId })
			.exec()
			.then(user => {
				if (!user && userData.email) {
					return this
						.usersModel
						.findOne({ email: userData.email }).exec()
						.then(userModel => !userModel ? this.create(userData) : userModel);
				} else {
					return user;
				}
			});
	}

	twitterCheckExistence(data) {
		const userData = {
			email: data.email,
			nickname: data.name,
			createdDate: Date.now(),
			socialId: `twitter_${data.id}`
		};

		return this
			.usersModel
			.findOne({ socialId: userData.socialId })
			.exec()
			.then(user => {
				if (user) return user;

				return this
						.usersModel
						.findOne({ email: userData.email })
						.exec()
						.then(userModel => !userModel ? this.create(userData) : userModel);
			});
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
}

module.exports = UsersManager;
