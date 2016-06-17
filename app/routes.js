'use strict';

const cors = require('cors');
const bodyParser = require('body-parser');
const routesConfig = require('../config/routes');

const AuthorizationMiddleware = require('../controllers/middlewares/authorizationMiddlerware');
const LanguageMiddleware = require('../controllers/middlewares/languageMiddleware');
const ErrorMiddleware = require('../controllers/middlewares/errorMiddleware');

const AuthorizationController = require('../controllers/authorizationController');
const LogsController = require('../controllers/logsController');
const FeedbacksController = require('../controllers/feedbacksController');
const UsersController = require('../controllers/usersController')

class AppRoutes {
	constructor(app, managers) {
		this.app = app;

		this.checkAuthorization = new AuthorizationMiddleware().authorize;
		this.obtainLanguage = new LanguageMiddleware().obtainLanguage;
		this.errorHandler = new ErrorMiddleware();

		this.authorizationController = new AuthorizationController(managers.authorization, managers.users);
		this.logsController = new LogsController(managers.logs);
		this.feedbacksController = new FeedbacksController(managers.feedbacks);
		this.usersController = new UsersController(managers.users);

		this.register = this.register.bind(this);
		this.registerHeader = this.registerHeader.bind(this);
		this.registerAuthorization = this.registerAuthorization.bind(this);
		this.registerLogs = this.registerLogs.bind(this);
		this.registerFeedbacks = this.registerFeedbacks.bind(this);
		this.registerFooter = this.registerFooter.bind(this);
	}

	register() {
		this.registerHeader(this.app);
		this.registerAuthorization(this.app, routesConfig.authorization, this.authorizationController);
		this.registerLogs(this.app, routesConfig.support, this.logsController);
		this.registerFeedbacks(this.app, routesConfig.support, this.feedbacksController);
		this.registerUsers(this.app, routesConfig.user, this.usersController);
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

	registerFeedbacks(app, paths, controller) {
		app.post(paths.feedback, this.checkAuthorization, controller.feedback);
		app.get(paths.getFeedbacks, this.checkAuthorization, controller.getFeedbacks);
	}

	registerUsers(app, paths, controller) {
		app.post(paths.edit, this.checkAuthorization, controller.edit);
	}
}

module.exports = AppRoutes;
