'use strict';

const mongoose = require('mongoose');
const databaseConfig = require('../config/database');

const UsersModel = require('../models/usersModel');
const BusinessUserModel = require('../models/businessUsersModel');
const AccessTokensModel = require('../models/accessTokensModel');

class AppDatabase {
	constructor() {
		this.bind();
		mongoose.connect(databaseConfig.uri, databaseConfig.options);

		this.usersModel = UsersModel(mongoose);
		this.businessUserModel = BusinessUserModel(mongoose);
		this.accessTokenModel = AccessTokensModel(mongoose);
	}
	bind() {
	}

	models() {
		return {
			user: this.usersModel,
			businessUser: this.businessUserModel,
			accessToken: this.accessTokenModel
		};
	}
	managers() {
		return {
		};
	}
	onStrart() {

	}
}

module.exports = AppDatabase;
