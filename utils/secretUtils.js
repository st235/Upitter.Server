'use strict';

const _ = require('underscore');
const crypto = require('crypto');
const secretConfig = require('../config/secret');

module.exports = {

	getHash(origin) {
		return crypto
			.createHmac('md5', secretConfig[0])
			.update(origin.toString())
			.digest('hex')
			.toString('utf8');
	},

	getUniqueHash(origin) {
		const secret = secretConfig[_.random(secretConfig.length - 1)];
		return crypto
			.createHmac('md5', secret)
			.update(origin.toString() + (Date.now() / 1000))
			.digest('hex')
			.toString('utf8');
	},
	
	generateCode() {
		return (Math.random() * 1e6).toFixed();
	}
};
