'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const AppUnit = require('./unit');

const BusinessUsersManager = require('../managers/businessUsersManager');
const UsersManager = require('../managers/usersManager');
const LogsManager = require('../managers/logsManager');
const FeedbackManager = require('../managers/feedbackManager');
const PostsManager = require('../managers/postsManager');
const CommentsManager = require('../managers/commentsManager');
const CategoriesManager = require('../managers/categoriesManager');

const usersModel = require('../models/usersModel');
const businessUsersModel = require('../models/businessUsersModel');
const countersModel = require('../models/counterModel');
const logsModel = require('../models/logsModel');
const feedbackModel = require('../models/feedbackModel');
const postsModel = require('../models/postsModel');
const votesModel = require('../models/votesModel');
const notificationsModel = require('../models/notificationsModel');
const mediaModel = require('../models/mediaModel');
const coordinatesModel = require('../models/coordinatesModel');
const commentsModel = require('../models/commentsModel');
const categoriesModel = require('../models/categoriesModel');

const { mixedLogger } = require('../utils/loggerUtils');
const databaseConfig = require('../config/database');

class AppDatabase extends AppUnit {
	_onBind() {
		this.models = this.models.bind(this);
		this.managers = this.managers.bind(this);
		this._onStart = this._onStart.bind(this);
	}

	_onCreate() {
		mongoose.connect(databaseConfig.uri, databaseConfig.options, this._onStart);

		this.countersModel = countersModel(mongoose);
		this.usersModel = usersModel(mongoose);
		this.businessUsersModel = businessUsersModel(mongoose);
		this.logsModel = logsModel(mongoose);
		this.feedbackModel = feedbackModel(mongoose);
		this.postsModel = postsModel(mongoose);
		this.votesModel = votesModel(mongoose);
		this.notificationsModel = notificationsModel(mongoose);
		this.mediaModel = mediaModel(mongoose);
		this.coordinatesModel = coordinatesModel(mongoose);
		this.commentsModel = commentsModel(mongoose);
		this.categoriesModel = categoriesModel(mongoose);

		this.usersManager = new UsersManager(this.usersModel);
		this.businessUsersManager = new BusinessUsersManager(this.businessUsersModel);
		this.logsManager = new LogsManager(this.logsModel);
		this.feedbackManager = new FeedbackManager(this.feedbackModel);
		this.postsManager = new PostsManager(this.postsModel);
		this.commentsManager = new CommentsManager(this.commentsModel);
		this.categoriesManager = new CategoriesManager(this.categoriesModel);
	}

	_onStart() {
		mixedLogger.info(`MongoDB started on uri ${databaseConfig.uri}`);
		this
			.countersModel
			.create()
			.then(model => mixedLogger.info(`Created ${model}`))
			.catch(error => mixedLogger.error(error));

		this
			.categoriesManager
			.createDefault();
	}

	managers() {
		return {
			users: this.usersManager,
			businessUsers: this.businessUsersManager,
			logs: this.logsManager,
			feedback: this.feedbackManager,
			posts: this.postsManager,
			comments: this.commentsManager,
			categories: this.categoriesManager
		};
	}

	models() {
		return {
			users: this.usersModel,
			businessUsers: this.businessUsersModel,
			counters: this.countersModel,
			logs: this.logsModel,
			feedback: this.feedbackModel,
			categories: this.categoriesModel,
			posts: this.postsModel,
			votes: this.votesModel,
			notifications: this.notificationsModel,
			media: this.mediaModel,
			coordinates: this.coordinatesModel,
			comments: this.commentsModel
		};
	}
}

module.exports = AppDatabase;
