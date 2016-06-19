'use strict';

const mongoose = require('mongoose');
const databaseConfig = require('../../../config/database');
databaseConfig.uri = 'mongodb://127.0.0.1:27017/upitter_test';

const { mixedLogger } = require('../../../utils/loggerUtils');

const usersModel = require('../../../models/usersModel');
const businessUserModel = require('../../../models/businessUsersModel');
const counterModel = require('../../../models/counterModel');
const logsModel = require('../../../models/logsModel');
const feedbacsModel = require('../../../models/feedbaksModel');
const categoriesModel = require('../../../models/categoriesModel');
const postsModel = require('../../../models/postsModel');
const votesModel = require('../../../models/votesModel');
const notificationsModel = require('../../../models/notificationsModel');
const mediaModel = require('../../../models/mediaModel');
const coordinatesModel = require('../../../models/coordinatesModel');
const commentsModel = require('../../../models/commentsModel');

const UsersManager = require('../../../managers/usersManager');
const BusinessUsersManager = require('../../../managers/businessUsersManager');
const LogsManager = require('../../../managers/logsManager');
const FeedbacksManager = require('../../../managers/feedbacksManager');
const PostsManager = require('../../../managers/postsManager');
const CommentsManager = require('../../../managers/commentsManager');

class AppDatabase {
	constructor() {
		this.bind();
		mongoose.connect(databaseConfig.uri, databaseConfig.options, this.onStart);

		this.counterModel = counterModel(mongoose);
		this.usersModel = usersModel(mongoose);
		this.businessUserModel = businessUserModel(mongoose);
		this.logsModel = logsModel(mongoose);
		this.feedbacksModel = feedbacsModel(mongoose);
		this.categoriesModel = categoriesModel(mongoose);
		this.postsModel = postsModel(mongoose);
		this.votesModel = votesModel(mongoose);
		this.notificationsModel = notificationsModel(mongoose);
		this.mediaModel = mediaModel(mongoose);
		this.coordinatesModel = coordinatesModel(mongoose);
		this.commentsModel = commentsModel(mongoose);

		this.usersManager = new UsersManager(this.usersModel);
		this.businessUsersManager = new BusinessUsersManager(this.businessUserModel);
		this.logsManager = new LogsManager(this.logsModel);
		this.feedbacksManager = new FeedbacksManager(this.feedbacksModel);
		this.postsManager = new PostsManager(this.postsModel);
		this.commentsManager = new CommentsManager(this.commentsModel);
	}

	bind() {
		this.models = this.models.bind(this);
		this.managers = this.managers.bind(this);
		this.onStart = this.onStart.bind(this);
	}

	managers() {
		return {
			users: this.usersManager,
			businessUsers: this.businessUsersManager,
			logs: this.logsManager,
			feedbacks: this.feedbacksManager,
			posts: this.postsManager,
			comments: this.commentsManager
		};
	}

	models() {
		return {
			user: this.usersModel,
			businessUser: this.businessUserModel,
			counter: this.counterModel,
			logs: this.logsModel,
			feedbacks: this.feedbacksModel,
			categoriesModel: this.categoriesModel,
			posts: this.postsModel,
			votes: this.votesModel,
			notifications: this.notificationsModel,
			media: this.mediaModel,
			coordinates: this.coordinatesModel,
			comments: this.commentsModel
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