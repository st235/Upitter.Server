'use strict';

const mongoose = require('mongoose');
const databaseConfig = require('../config/database');

const { mixedLogger } = require('../utils/loggerUtils');

const UsersModel = require('../models/usersModel');
const BusinessUserModel = require('../models/businessUsersModel');
const AccessTokensModel = require('../models/accessTokensModel');
const CounterModel = require('../models/counterModel');

const UsersManager = require('../managers/usersManager');
const AuthorizationManager = require('../managers/authorizationManager');

class AppDatabase {
	constructor() {
		this.bind();
		mongoose.connect(databaseConfig.uri, databaseConfig.options, this.onStart);
		this.usersModel = UsersModel(mongoose);
		this.businessUserModel = BusinessUserModel(mongoose);
		this.accessTokenModel = AccessTokensModel(mongoose);
		this.counterModel = CounterModel(mongoose);

		this.usersManager = new UsersManager(this.usersModel);
		this.authorizationManager = new AuthorizationManager();
	}

	bind() {
		this.models = this.models.bind(this);
		this.managers = this.managers.bind(this);
		this.onStart = this.onStart.bind(this);
	}

	models() {
		return {
			user: this.usersModel,
			businessUser: this.businessUserModel,
			accessToken: this.accessTokenModel,
			counter: this.counterModel
		};
	}

	managers() {
		return {
			users: this.usersManager,
			authorization: this.authorizationManager,
		};
	}

	onStart() {
		this.counterModel
			.create()
			.then(model => mixedLogger.info(`Created ${model}`))
			.catch(error => mixedLogger.error(error));
	}
}

module.exports = AppDatabase;
