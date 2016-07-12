'use strict';

const RedisUtils = require('../utils/redisUtils');

class RedisService {
	static init(config) {
		this._config = config;
		this._defaultHost = 'pub-redis-19787.us-east-1-3.1.ec2.garantiadata.com';
		this.clients = Object.create(null);
		const databaseNames = Object.keys(config);
		databaseNames.forEach(dbName => this._addClient(dbName));
	}

	static _addClient(dbName) {
		const self = this;
		const configInfo = this._config[dbName];
		const ports = configInfo.ports;

		const credentials = ports.map(port => {
			if (!configInfo.host) return { host: self._defaultHost, port };
			return { host: configInfo.host, port };
		});

		const options = {
			database: configInfo.database || 0,
			usePromise: true,
			authPass: configInfo.authPass || ''
		};

		this.clients[dbName] = new RedisUtils(dbName, credentials, options);
	}

	static getClientByName(name) {
		if (name in this.clients) return this.clients[name];
		throw new Error("Client with such name doesn't exist");
	}

	static getClientByDbNumber(number) {
		for (const key in this.clients) {
			const client = this.clients[key];
			const dbNumber = client.getDbNumber();
			if (dbNumber === number) return client;
		}
	}
}

module.exports = RedisService;
