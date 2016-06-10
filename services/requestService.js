'use strict';

const request = require('request');

const REQUEST_RESPONSE = 'response';
const REQUEST_ERROR = 'error';

class RequestService {
	static post(url, query, body) {
		return new Promise((resolve, reject) => request({
			url,
			qs: query,
			method: 'POST',
			body
		}, (error, response, body) => {
			if (error || response.statusCode !== 200) return reject(error);
			return resolve(body);
		}));
	}

	static get(url, query) {
		return new Promise((resolve, reject) => request({
			url,
			qs: query,
			method: 'GET'
		}, (error, response, body) => {
			if (error || response.statusCode !== 200) return reject(error);
			return resolve(body);
		}));
	}
}

module.exports = RequestService;
