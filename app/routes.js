'use strict';
const bodyParser = require('body-parser');
const routesConfig = require('../config/routes');

const AuthorizationController = require('../controllers/authorizationController');

class AppRoutes {
	constructor(app, managers) {
		this.app = app;

		this.register = this.register.bind(this);
		this.registerParser = this.registerParser.bind(this);

		this.authorizationController = new AuthorizationController(managers.authorization, managers.users);

		this.registerAuthorization = this.registerAuthorization.bind(this);
	}

	register() {
		this.registerParser(this.app);
		this.registerAuthorization(this.app, routesConfig.authorization, this.authorizationController);
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
}

module.exports = AppRoutes;
