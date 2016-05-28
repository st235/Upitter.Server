'use strict';

const express = require('express');

const AppRoutes = require('./routes');
const AppDatabase = require('./database');

const { mixedLogger } = require('../utils/loggerUtils');
const httpConfig = require('../config/http');

class AppServer {
	constructor() {
		const app = express();
		app.listen(httpConfig.PORT, () => mixedLogger.info(`App is started on ${httpConfig.PORT} port`));
	}

	start() {

	}
}

module.exports = AppServer;
