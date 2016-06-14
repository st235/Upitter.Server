'use strict';

const bodyParser = require('body-parser');
const cors = require('cors');
const routesConfig = require('../config/routes');

const AuthorizationMiddleware = require('../controllers/middlewares/authorizationMiddlerware');
const LanguageMiddleware = require('../controllers/middlewares/languageMiddleware');
const ErrorMiddleware = require('../controllers/middlewares/errorMiddleware');

const AuthorizationController = require('../controllers/authorizationController');
const LogsController = require('../controllers/logsController');
const FeedbacksController = require('../controllers/feedbacksController');

class AppRoutes {
	constructor(app, managers) {
		this.app = app;

		this.checkAuthorization = new AuthorizationMiddleware().authorize;
		this.obtainLanguage = new LanguageMiddleware().obtainLanguage;
		this.errorHandler = new ErrorMiddleware();

		this.authorizationController = new AuthorizationController(managers.authorization, managers.users);
		this.logsController = new LogsController(managers.logs);
		this.feedbacksController = new FeedbacksController(managers.feedbacks);

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

	registerAuthorization(app, path, controller) {
		app.post(path.googleVerify, controller.googleVerify);
		app.post(path.facebookVerify, controller.facebookVerify);
		app.post(path.twitterVerify, controller.twitterVerify);
	}

	registerLogs(app, path, controller) {
		app.post(path.log, this.checkAuthorization, controller.log);
		app.get(path.getLogs, this.checkAuthorization, controller.getLogs);
	}

	registerFeedbacks(app, path, controller) {
		app.post(path.feedback, this.checkAuthorization, controller.feedback);
		app.get(path.getFeedbacks, this.checkAuthorization, controller.getFeedbacks);
	}
}

module.exports = AppRoutes;
