'use strict';

const express = require('express');

const AppRoutes = require('./routes');
const AppDatabase = require('./database');

const ErrorService = require('../../../services/errorService');
const SMSService = require('../../../services/smsService');
const RedisService = require('../../../services/redisService');
const { mixedLogger } = require('../../../utils/loggerUtils');
const redisConfig = require('../../../config/redis');
const httpConfig = require('../../../config/http');

class AppServer {
	constructor() {
		const app = express();
		app.listen(httpConfig.PORT, () => mixedLogger.info(`App is started on ${httpConfig.PORT} port`));

		this.init();
		const managers = new AppDatabase().managers();
		this.routes = new AppRoutes(app, managers);

		this.start = this.start.bind(this);
	}

	init() {
		ErrorService.init();
		SMSService.setEnv('dev');
		this.initRedis();
	}

	initRedis() {
		RedisService.init(redisConfig);

		let i = 1;

		while (true) {
			const client = RedisService.getClientByDbNumber(i);
			if (!client) break;

			client.setConnectionHandler();
			client.setErrorHandler();
			client.setEndHandler();

			i++;
		}
	}

	start() {
		this.routes.register();
	}
}

module.exports = AppServer;
