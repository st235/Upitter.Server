'use strict';

const request = require('request');

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
}

module.exports = RequestService;
