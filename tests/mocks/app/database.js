'use strict';

const mongoose = require('mongoose');
const databaseConfig = require('../../../config/database');
databaseConfig.uri = 'mongodb://127.0.0.1:27017/upitter_test';

const { mixedLogger } = require('../../../utils/loggerUtils');

const usersModel = require('../../../models/userModel');
const businessUserModel = require('../../../models/companyModel');
const counterModel = require('../../../models/counterModel');
const logsModel = require('../../../models/logModel');
const feedbacsModel = require('../../../models/feedbaksModel');
const categoriesModel = require('../../../models/categoryModel');
const postsModel = require('../../../models/postModel');
const votesModel = require('../../../models/voteModel');
const notificationsModel = require('../../../models/notificationModel');
const mediaModel = require('../../../models/mediaModel');
const coordinatesModel = require('../../../models/coordinatesModel');
const commentsModel = require('../../../models/commentModel');

const UsersManager = require('../../../managers/usersManager');
const BusinessUsersManager = require('../../../managers/companiesManager');
const LogsManager = require('../../../managers/logsManager');
const FeedbacksManager = require('../../../managers/feedbackManager');
const PostsManager = require('../../../managers/postsManager');
const CommentsManager = require('../../../managers/commentsManager');

class AppDatabase {
	constructor() {
		this.bind();
		mongoose.connect(databaseConfig.uri, databaseConfig.options, this.onStart);

		this.counterModel = counterModel(mongoose);
		this.userModel = usersModel(mongoose);
		this.businessUserModel = businessUserModel(mongoose);
		this.logModel = logsModel(mongoose);
		this.feedbacksModel = feedbacsModel(mongoose);
		this.categoryModel = categoriesModel(mongoose);
		this.postModel = postsModel(mongoose);
		this.voteModel = votesModel(mongoose);
		this.notificationModel = notificationsModel(mongoose);
		this.mediaModel = mediaModel(mongoose);
		this.coordinatesModel = coordinatesModel(mongoose);
		this.commentModel = commentsModel(mongoose);

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
