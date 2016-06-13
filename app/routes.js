'use strict';
const bodyParser = require('body-parser');
const routesConfig = require('../config/routes');

const AuthorizationMiddleware = require('../controllers/middlewares/authorizationMiddlerware');

const AuthorizationController = require('../controllers/authorizationController');
const LogsController = require('../controllers/logsController');
const FeedbacksController = require('../controllers/feedbacksController');

class AppRoutes {
	constructor(app, managers) {
		this.app = app;
		this.authorizationMiddleware = new AuthorizationMiddleware();

		this.authorizationController = new AuthorizationController(managers.authorization, managers.users);
		this.logsController = new LogsController(managers.logs);
		this.feedbacksController = new FeedbacksController(managers.feedbacks);

		this.register = this.register.bind(this);
		this.registerParser = this.registerParser.bind(this);
		this.registerAuthorization = this.registerAuthorization.bind(this);
	}

	register() {
		this.registerParser(this.app);
		this.registerAuthorization(this.app, routesConfig.authorization, this.authorizationController);
		this.registerLogs(this.app, routesConfig.support, this.logsController);
		this.registerFeedbacks(this.app, routesConfig.support, this.feedbacksController);
	}

	registerParser(app) {
		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({ extended: true }));
	}

	registerAuthorization(app, path, controller) {
		app.post(path.googleVerify, controller.googleVerify);
		app.post(path.facebookVerify, controller.facebookVerify);
		app.post(path.twitterVerify, controller.twitterVerify);
	}

	registerLogs(app, path, controller) {
		app.post(path.log, this.authorizationMiddleware.authorize, controller.log);
		app.get(path.getLogs, this.authorizationMiddleware.authorize, controller.getLogs);
	}

	registerFeedbacks(app, path, controller) {
		app.post(path.feedback, this.authorizationMiddleware.authorize, controller.feedback);
		app.get(path.getFeedbacks, this.authorizationMiddleware.authorize, controller.getFeedbacks);
	}
}

module.exports = AppRoutes;
