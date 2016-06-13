'use strict';

const mongoose = require('mongoose');
const databaseConfig = require('../config/database');

const { mixedLogger } = require('../utils/loggerUtils');

const usersModel = require('../models/usersModel');
const businessUserModel = require('../models/businessUsersModel');
const counterModel = require('../models/counterModel');
const logsModel = require('../models/logsModel');
const feedbacsModel = require('../models/feedbaksModel');

const UsersManager = require('../managers/usersManager');
const LogsManager = require('../managers/logsManager');
const FeedbacksManager = require('../managers/feedbacksManager');

class AppDatabase {
	constructor() {
		this.bind();
		mongoose.connect(databaseConfig.uri, databaseConfig.options, this.onStart);

		this.counterModel = counterModel(mongoose);
		this.usersModel = usersModel(mongoose);
		this.businessUserModel = businessUserModel(mongoose);
		this.logsModel = logsModel(mongoose);
		this.feedbacksModel = feedbacsModel(mongoose);

		this.usersManager = new UsersManager(this.usersModel);
		this.logsManager = new LogsManager(this.logsModel);
		this.feedbacksManager = new FeedbacksManager(this.feedbacksModel);
	}

	bind() {
		this.models = this.models.bind(this);
		this.managers = this.managers.bind(this);
		this.onStart = this.onStart.bind(this);
	}

	managers() {
		return {
			users: this.usersManager,
			logs: this.logsManager,
			feedbacks: this.feedbacksManager
		};
	}

	models() {
		return {
			user: this.usersModel,
			businessUser: this.businessUserModel,
			counter: this.counterModel,
			logs: this.logsModel,
			feedbacks: this.feedbacksModel
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
