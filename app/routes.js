'use strict';
const routesConfig = require('../config/routes');

class AppRoutes {
	constructor(app, managers) {
		this.app = app;
		this.register = this.register.bind(this);
	}

	register() {

	}
}

module.exports = AppRoutes;
