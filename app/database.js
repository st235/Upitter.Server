'use strict';

const mongoose = require('mongoose');
const databaseConfig = require('../config/database');

const { mixedLogger } = require('../utils/loggerUtils');

const usersModel = require('../models/usersModel');
const businessUserModel = require('../models/businessUsersModel');
const accessTokensModel = require('../models/accessTokensModel');
const counterModel = require('../models/counterModel');

const UsersManager = require('../managers/usersManager');
const AuthorizationManager = require('../managers/authorizationManager');

class AppDatabase {
	constructor() {
		this.bind();
		mongoose.connect(databaseConfig.uri, databaseConfig.options, this.onStart);

		this.usersModel = usersModel(mongoose);
		this.businessUserModel = businessUserModel(mongoose);
		this.accessTokenModel = accessTokensModel(mongoose);
		this.counterModel = counterModel(mongoose);

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
		this
			.counterModel
			.create()
			.then(model => mixedLogger.info(`Created ${model}`))
			.catch(error => mixedLogger.error(error));
	}
}

module.exports = AppDatabase;
