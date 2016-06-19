'use strict';

const cors = require('cors');
const bodyParser = require('body-parser');
const routesConfig = require('../config/routes');

const AuthorizationMiddleware = require('../controllers/middlewares/authorizationMiddlerware');
const LanguageMiddleware = require('../controllers/middlewares/languageMiddleware');
const ErrorMiddleware = require('../controllers/middlewares/errorMiddleware');

const AuthorizationController = require('../controllers/authorizationController');
const LogsController = require('../controllers/logsController');
const FeedbackController = require('../controllers/feedbackController');
const UsersController = require('../controllers/usersController');
const PostsController = require('../controllers/postsController');
const CommentController = require('../controllers/commentsController');

class AppRoutes {
	constructor(app, managers) {
		this.app = app;

		this.checkAuthorization = new AuthorizationMiddleware().authorize;
		this.obtainLanguage = new LanguageMiddleware().obtainLanguage;
		this.errorHandler = new ErrorMiddleware();

		this.authorizationController = new AuthorizationController(managers.users);
		this.logsController = new LogsController(managers.logs);
		this.feedbackController = new FeedbackController(managers.feedbacks);
		this.usersController = new UsersController(managers.users);
		this.postsController = new PostsController(managers.posts);
		this.commentsController = new CommentController(managers.comments);

		this.register = this.register.bind(this);
		this.registerHeader = this.registerHeader.bind(this);
		this.registerAuthorization = this.registerAuthorization.bind(this);
		this.registerLogs = this.registerLogs.bind(this);
		this.registerFeedback = this.registerFeedback.bind(this);
		this.registerFooter = this.registerFooter.bind(this);
	}

	register() {
		this.registerHeader(this.app);
		this.registerAuthorization(this.app, routesConfig.authorization, this.authorizationController);
		this.registerLogs(this.app, routesConfig.support, this.logsController);
		this.registerFeedback(this.app, routesConfig.support, this.feedbackController);
		this.registerUsers(this.app, routesConfig.user, this.usersController);
		this.registerPosts(this.app, routesConfig.post, this.postsController);
		this.registerComments(this.app, routesConfig.comment, this.commentsController);
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
	}

	registerPosts(app, paths, controller) {
		app.post(paths.create, controller.create);
		app.post(paths.edit, controller.edit);
		app.get(paths.remove, controller.remove);
		app.get(paths.obtain, controller.obtain);
	}

	registerComments(app, paths, controller) {
		app.post(paths.create, this.checkAuthorization, controller.create);
		app.get(paths.remove, controller.remove);
		app.get(paths.obtain, controller.obtain);
	}
}

module.exports = AppRoutes;
