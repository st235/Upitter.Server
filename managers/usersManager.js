'use strict';

const _ = require('underscore');

class UsersManager {
	constructor(usersModel) {
		this.usersModel = usersModel;

		this.googleCheckExistence = this.googleCheckExistence.bind(this);
		this.facebookCheckExistence = this.facebookCheckExistence.bind(this);
		this.twitterCheckExistence = this.twitterCheckExistence.bind(this);
		this.create = this.create.bind(this);
	}

	googleCheckExistence(json) {
		const data = JSON.parse(json);
		const userData = _.pick(data, 'email', 'name', 'picture');
		userData.socialIds = {
			google: data.kid
		};
		return this
			.usersModel
			.findOne({ 'socialIds.google': userData.socialIds.google })
			.exec()
			.then(user => !user ? this.create(userData) : user);
	}


	facebookCheckExistence(json) {
		const data = JSON.parse(json);
		const userData = _.pick(data, 'email', 'name');
		userData.socialIds = {
			facebook: data.id
		};
		return this
			.usersModel
			.findOne({ 'socialIds.facebook': userData.socialIds.facebook })
			.exec()
			.then(user => !user ? this.create(userData) : user);
	}

	twitterCheckExistence(data) {
		const userData = _.pick(data, 'email', 'name');
		userData.socialIds = {
			twitter: data.id
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
}

module.exports = UsersManager;
