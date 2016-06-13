'use strict';

const Twitter = require('node-twitter-api');
const authorization = require('../config/authorization');

class SocialRequestUtils {
	static init() {
		this.twitter = new Twitter({
			consumerKey: authorization.twitter.CONSUMER_KEY,
			consumerSecret: authorization.twitter.CONSUMER_SECRET
		});
	}

	static getTwitter(token, secret) {
		return new Promise((resolve, reject) => this.twitter.verifyCredentials(token, secret, {}, (error, data) => error ? reject(error) : resolve(data)));
	}
}

module.exports = SocialRequestUtils;
