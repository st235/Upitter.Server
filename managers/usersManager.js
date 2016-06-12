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
			google: +data.id
		};
		userData.socialIds.google = data.id;
		return this.usersModel
			.findByGoogleId(userData.socialIds.google)
			.then(user => (!user ? this.create(userData) : user));
	}


	facebookCheckExistence(json) {
		const data = JSON.parse(json);
		const userData = _.pick(data, 'email', 'name');
		userData.socialIds = {
			facebook: +data.id
		};
		return this.usersModel
			.findByFacebookId(userData.socialIds.facebook)
			.then((user) => (!user ? this.create(userData) : user));
	}

	twitterCheckExistence(data) {
		const userData = _.pick(data, 'email', 'name');
		userData.socialIds = {
			twitter: +data.id
		};
		console.log(userData);
		return this.usersModel
			.findByTwitterId(userData.socialIds.twitter)
			.then((user) => (!user ? this.create(userData) : user));
	}

	create(data) {
		const user = this.usersModel(data);
		return user.save((error, newUser) => {
			if (error) throw error;
			return newUser;
		});
	}
}

module.exports = UsersManager;
