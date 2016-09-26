'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const AppUnit = require('./unit');

const CategoriesManager = require('../managers/categoriesManager');
const CommentsManager = require('../managers/commentsManager');
const CompaniesManager = require('../managers/companiesManager');
const FeedbackManager = require('../managers/feedbackManager');
const LogsManager = require('../managers/logsManager');
const PostsManager = require('../managers/postsManager');
const ReportsManager = require('../managers/reportsManager');
const UsersManager = require('../managers/usersManager');

const categoryModel = require('../models/categoryModel');
const commentModel = require('../models/commentModel');
const companyModel = require('../models/companyModel');
const counterModel = require('../models/counterModel');
const feedbackModel = require('../models/feedbackModel');
const logModel = require('../models/logModel');
const mediaModel = require('../models/mediaModel');
const notificationModel = require('../models/notificationModel');
const postModel = require('../models/postModel');
const reportModel = require('../models/reportModel');
const reportReasonModel = require('../models/reportReasonModel');
const voteModel = require('../models/voteModel');
const userModel = require('../models/userModel');

const { mixedLogger } = require('../utils/loggerUtils');
const databaseConfig = require('../config/database');

class AppDatabase extends AppUnit {
	_onBind() {
		this.models = this.models.bind(this);
		this.managers = this.managers.bind(this);
		this._onStart = this._onStart.bind(this);
	}

	_onCreate() {
		mongoose.connect(databaseConfig.devUri, databaseConfig.options, this._onStart);
		// mongoose.connect(databaseConfig.prodUri, databaseConfig.options, this._onStart);

		this.categoryModel = categoryModel(mongoose);
		this.commentModel = commentModel(mongoose);
		this.companyModel = companyModel(mongoose);
		this.counterModel = counterModel(mongoose);
		this.feedbackModel = feedbackModel(mongoose);
		this.logModel = logModel(mongoose);
		this.mediaModel = mediaModel(mongoose);
		this.notificationModel = notificationModel(mongoose);
		this.postModel = postModel(mongoose);
		this.reportModel = reportModel(mongoose);
		this.reportReasonModel = reportReasonModel(mongoose);
		this.userModel = userModel(mongoose);
		this.voteModel = voteModel(mongoose);

		this.categoriesManager = new CategoriesManager(this.categoryModel);
		this.commentsManager = new CommentsManager(this.commentModel, this.userModel);
		this.companiesManager = new CompaniesManager(this.companyModel);
		this.feedbackManager = new FeedbackManager(this.feedbackModel);
		this.logsManager = new LogsManager(this.logModel);
		this.postsManager = new PostsManager(this.postModel, this.companyModel, this.commentModel);
		this.reportsManager = new ReportsManager(this.reportModel, this.reportReasonModel, this.companyModel, this.commentModel, this.postModel);
		this.usersManager = new UsersManager(this.userModel);
	}

	_onStart(error) {
		if (error) mixedLogger.error('MongoDB error: ', error);
		mixedLogger.info(`MongoDB started on uri ${databaseConfig.devUri}`);

		this
			.counterModel
			.create()
			.then(counter => mixedLogger.info(`Created ${counter}`))
			.catch(counterError => mixedLogger.error(counterError));

		this.categoriesManager.createDefault();
		this.reportsManager.createDefaultReportReasons();
	}

	managers() {
		return {
			categories: this.categoriesManager,
			comments: this.commentsManager,
			companies: this.companiesManager,
			feedback: this.feedbackManager,
			logs: this.logsManager,
			posts: this.postsManager,
			reports: this.reportsManager,
			users: this.usersManager
		};
	}

	models() {
		return {
			category: this.categoryModel,
			comment: this.commentModel,
			company: this.companyModel,
			counter: this.counterModel,
			feedback: this.feedbackModel,
			log: this.logModel,
			media: this.mediaModel,
			notification: this.notificationModel,
			post: this.postModel,
			report: this.reportModel,
			reportReason: this.reportReasonModel,
			user: this.userModel,
			vote: this.voteModel
		};
	}
}

module.exports = AppDatabase;
