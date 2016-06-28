'use strict';

const cors = require('cors');
const bodyParser = require('body-parser');
const routesConfig = require('../config/routes');

const AppUnit = require('./unit');

const AuthorizationMiddleware = require('../controllers/middlewares/authorizationMiddlerware');
const LanguageMiddleware = require('../controllers/middlewares/languageMiddleware');
const ErrorMiddleware = require('../controllers/middlewares/errorMiddleware');

const AuthorizationController = require('../controllers/authorizationController');
const LogsController = require('../controllers/logsController');
const FeedbackController = require('../controllers/feedbackController');
const UsersController = require('../controllers/usersController');
const PostsController = require('../controllers/postsController');
const CommentController = require('../controllers/commentsController');
const CategoriesController = require('../controllers/categoriesController');
const BusinessUsersController = require('../controllers/businessUsersController');

class AppRoutes extends AppUnit {
	constructor(app, managers) {
		super({ app, managers });
	}

	_onBind() {
		this.register = this.register.bind(this);
		this.registerHeader = this.registerHeader.bind(this);
		this.registerAuthorization = this.registerAuthorization.bind(this);
		this.registerLogs = this.registerLogs.bind(this);
		this.registerFeedback = this.registerFeedback.bind(this);
		this.registerFooter = this.registerFooter.bind(this);
	}

	_onCreate() {
		this.checkAuthorization = new AuthorizationMiddleware().authorize;
		this.obtainLanguage = new LanguageMiddleware().obtainLanguage;
		this.errorHandler = new ErrorMiddleware();

		this.authorizationController = new AuthorizationController(this.managers.users, this.managers.businessUsers);
		this.logsController = new LogsController(this.managers.logs);
		this.feedbackController = new FeedbackController(this.managers.feedback);
		this.usersController = new UsersController(this.managers.users, this.managers.businessUsers);
		this.postsController = new PostsController(this.managers.posts);
		this.commentsController = new CommentController(this.managers.comments);
		this.categoriesController = new CategoriesController(this.managers.categories);
		this.businessUsersController = new BusinessUsersController(this.managers.businessUsers);
	}

	register() {
		this.registerHeader(this.app);
		this.registerAuthorization(this.app, routesConfig.authorization, this.authorizationController);
		this.registerLogs(this.app, routesConfig.support, this.logsController);
		this.registerFeedback(this.app, routesConfig.support, this.feedbackController);
		this.registerUsers(this.app, routesConfig.user, this.usersController);
		this.registerPosts(this.app, routesConfig.post, this.postsController);
		this.registerComments(this.app, routesConfig.comment, this.commentsController);
		this.registerCategories(this.app, routesConfig.category, this.categoriesController);
		this.registerBusinessUsers(this.app, routesConfig.businessUser, this.businessUsersController);
		this.registerFooter(this.app);
	}

	registerHeader(app) {
		app.use(cors());
		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({ extended: true }));
		app.use(this.obtainLanguage);
	}

	registerFooter(app) {
		app.use(this.errorHandler.obtainError);
		app.use(this.errorHandler.handleError);
	}

	registerAuthorization(app, paths, controller) {
		app.get(paths.verifyToken, controller.verifyToken);
		app.get(paths.refreshToken, controller.refreshToken);
		app.post(paths.googleVerify, controller.googleVerify);
		app.post(paths.facebookVerify, controller.facebookVerify);
		app.post(paths.twitterVerify, controller.twitterVerify);

		app.post(paths.authorizeByPhone, controller.authorizeByPhone);
		app.post(paths.verifyCode, controller.verifyCode);
		app.post(paths.addInfo, controller.addInfo);
	}

	registerLogs(app, paths, controller) {
		app.post(paths.log, this.checkAuthorization, controller.log);
		app.get(paths.getLogs, this.checkAuthorization, controller.getLogs);
	}

	registerFeedback(app, paths, controller) {
		app.post(paths.feedback, this.checkAuthorization, controller.feedback);
		app.get(paths.getFeedback, this.checkAuthorization, controller.getFeedback);
	}

	registerUsers(app, paths, controller) {
		app.post(paths.edit, this.checkAuthorization, controller.edit);
		app.post(paths.addToSubscriptions, this.checkAuthorization, controller.addToSubscriptions);
		app.post(paths.removeFromSubscriptions, this.checkAuthorization, controller.removeFromSubscriptions);
		app.post(paths.getSubscriptions, this.checkAuthorization, controller.getSubscriptions);
	}

	registerPosts(app, paths, controller) {
		app.post(paths.create, this.checkAuthorization, controller.create);
		app.post(paths.edit, controller.edit);
		app.get(paths.remove, controller.remove);
		app.get(paths.obtain, controller.obtain);
		app.get(paths.like, this.checkAuthorization, controller.like);
	}

	registerComments(app, paths, controller) {
		app.post(paths.create, this.checkAuthorization, controller.create);
		app.get(paths.remove, controller.remove);
		app.get(paths.obtain, controller.obtain);
	}

	registerCategories(app, paths, controller) {
		app.get(paths.obtain, controller.getCategories);
		app.get(paths.find, controller.findCategory);
	}

	registerBusinessUsers(app, paths, controller) {
		app.post(paths.edit, this.checkAuthorization, controller.edit);
		app.post(paths.getSubscribers, this.checkAuthorization, controller.getSubscribers);
	}
}

module.exports = AppRoutes;
