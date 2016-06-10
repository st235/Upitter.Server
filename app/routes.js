'use strict';

const bodyParser = require('body-parser');

const AuthorizationController = require('../controllers/authorizationController');
const routesConfig = require('../config/routes');

class AppRoutes {
	constructor(app, managers) {
		this.app = app;
		this.authorizationController = new AuthorizationController();

		this.register = this.register.bind(this);
		this.registerParser = this.registerParser.bind(this);
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

	registerAuthorization(app, paths, controller) {
		app.post(paths.googleVerify, controller.googleVerify);
	}
}

module.exports = AppRoutes;
