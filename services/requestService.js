'use strict';

const request = require('request');
const Twitter = require('node-twitter-api');
const twitter = new Twitter({
	consumerKey: '1vlgOKvm0SawasSOwPb2r2zTr',
	consumerSecret: '9crEIAVjJFH9bUSjXYW487aLGdmI9MNAZouxy7Hg7U5f2ZFYP8'
});

class RequestService {
	static post(url, query, body) {
		return new Promise((resolve, reject) => request({
			url,
			qs: query,
			method: 'POST',
			body
		}, (error, response, responseBody) => {
			if (error || response.statusCode !== 200) return reject(error);
			return resolve(responseBody);
		}));
	}

	static get(url, query) {
		return new Promise((resolve, reject) => request({
			url,
			qs: query,
			method: 'GET'
		}, (error, response, responseBody) => {
			if (error || response.statusCode !== 200) return reject(error);
			return resolve(responseBody);
		}));
	}

	static getTwitter(token, secret) {
		return new Promise((resolve, reject) => {
			return twitter.verifyCredentials(token, secret, {}, function (error, data) {
				if (error) return reject(error);
				return resolve(data);
			});
		});
	}
}

module.exports = RequestService;
