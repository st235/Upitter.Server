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
		const data = JSON.parse(json);
		const userData = {
			email: data.email,
			picture: data.picture,
			nickname: data.name,
			createdDate: Date.now(),
			socialIds: `google_${data.email}`
		};

		return this
			.usersModel
			.findOne({ 'socialIds.google': userData.socialIds.google })
			.exec()
			.then(user => !user ? this.create(userData) : user);
	}


	facebookCheckExistence(json) {
		const data = JSON.parse(json);
		const userData = {
			email: data.email,
			nickname: data.name,
			createdDate: Date.now(),
			socialIds: `facebook_${data.id}`
		};

		return this
			.usersModel
			.findOne({ 'socialIds.facebook': userData.socialIds.facebook })
			.exec()
			.then(user => !user ? this.create(userData) : user);
	}

	twitterCheckExistence(data) {
		const userData = {
			email: data.email,
			nickname: data.name,
			createdDate: Date.now(),
			socialIds: `twitter_${data.id}`
		};

		return this
			.usersModel
			.findOne({ 'socialIds.twitter': userData.socialIds.twitter })
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
}

module.exports = UsersManager;
