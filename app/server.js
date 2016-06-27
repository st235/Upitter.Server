'use strict';

const path = require('path');
const express = require('express');

const AppUnit = require('./unit');
const AppRoutes = require('./routes');
const AppDatabase = require('./database');

const ErrorService = require('../services/errorService');
const SMSService = require('../services/smsService');
const RedisService = require('../services/redisService');
const LocaleService = require('default-locale');

const { mixedLogger } = require('../utils/loggerUtils');
const localeConfig = require('../config/locale')(path.join(__dirname, '../'));
const redisConfig = require('../config/redis');
const httpConfig = require('../config/http');

class AppServer extends AppUnit {
	_onBind() {
		this.start = this.start.bind(this);
	}

	_onCreate() {
		const app = express();
		app.listen(httpConfig.PORT, () => mixedLogger.info(`App is started on ${httpConfig.PORT} port`));

		LocaleService.init(localeConfig);
		RedisService.init(redisConfig);
		ErrorService.init();

		const managers = new AppDatabase().managers();
		this.routes = new AppRoutes(app, managers);
	}

	start() {
		this.routes.register();
	}
}

module.exports = new AppServer();
