'use strict';

const request = require('request');

class RequestService {
	static post(url, query, body) {
		return new Promise((resolve, reject) => request({
			url,
			qs: query,
			method: 'POST',
			body,
			json: true
		}, (error, response, responseBody) => {
			if (error || response.statusCode !== 200) return reject('REQUEST_SERVICE_ERROR');

			try {
				responseBody = JSON.parse(responseBody);
			} catch(e) {
				return reject('REQUEST_SERVICE_ERROR');
			}

			return resolve(responseBody);
		}));
	}

	static get(url, query) {
		return new Promise((resolve, reject) => request({
			url,
			qs: query,
			method: 'GET'
		}, (error, response, responseBody) => {
			if (error || response.statusCode !== 200) return reject('REQUEST_SERVICE_ERROR');
			
			try {
				responseBody = JSON.parse(responseBody);
			} catch(e) {
				return reject('REQUEST_SERVICE_ERROR');
			}
			
			return resolve(responseBody);
		}));
	}
}

module.exports = RequestService;
