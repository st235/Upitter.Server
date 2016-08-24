'use strict';

const Twitter = require('node-twitter-api');

const authorization = require('../config/authorization');
const requestService = require('../services/requestService');

class SocialRequestUtils {
	static init() {
		this.twitter = new Twitter({
			consumerKey: authorization.twitter.CONSUMER_KEY,
			consumerSecret: authorization.twitter.CONSUMER_SECRET
		});
	}

	static getTwitter(token, secret) {
		return new Promise((resolve, reject) => this.twitter.verifyCredentials(
			token,
			secret,
			{},
			(error, data) => error ? reject('REQUEST_SERVICE_ERROR') : resolve(data)));
	}

	static getGoogle(url, query) {
		return requestService.get(url, query);
	}

	static getFacebook(url, query) {
		return requestService.get(url, query);
	}

	static getVk(url, query) {
		return requestService.get(url, query);
	}
}

module.exports = SocialRequestUtils;
