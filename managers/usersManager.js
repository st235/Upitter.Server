'use strict';

const _ = require('underscore');

class UsersManager {
	constructor(usersModel) {
		this.usersModel = usersModel;

		this.checkExistence = this.checkExistence.bind(this);
		this.create = this.create.bind(this);
	}

	checkExistence(json) {
		const data = JSON.parse(json);
		return this.usersModel.findByEmail(data.email).then((user) => {
			return !user ? this.create(data) : user;
		});
	}

	create(data) {
		const userData = _.pick(data, 'email', 'name', 'picture');
		const user = this.usersModel(userData);
		return user.save(newUser => {
			return newUser;
		});
	}
}

module.exports = UsersManager;