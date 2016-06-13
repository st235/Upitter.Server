'use strict';

const request = require('unirest');
const crypto = require('crypto');
const _ = require('underscore');
const smsConfig = require('../config/smsProvider/sms16');

class SMS16Strategy {
	_formSuccessResponse(response) {
		console.log(response);
		return response;
	}

	_formErrorResponse(error) {
		console.log(error);
		throw error;
	}

	constructor(code, phone, text) {
		this.code = code;
		this.phone = phone;
		this.text = text;
	}

	static init(phone, text) {
		return new this(phone, text);
	}

	_clear() {
		this.code = null;
		this.phone = null;
		this.text = null;
	}

	_hashSMSObject(smsObj) {
		return crypto.createHash('md5').update(smsObj, 'utf8').digest('hex');
	}

	_getTimeStamp() {
		return new Promise((resolve, reject) => {
			request
				.get(smsConfig.api.BASE_URL + 'get/timestamp.php')
				.strictSSL(false)
				.end(function (res) {
					if (res.status === 200) {
						return resolve(res.body);
					} else if (res.text && res.text.error) {
						return reject(res.text.error);
					} else {
						//TODO: Подключить ошибки
						return reject(new Error('Ошибка получения timestamp'));
					}
				});
		});
	}

	_generateQueryString(timestamp) {
		var objToSend = {
			login: smsConfig.api.API_LOGIN,
			phone: this.phone,
			sender: smsConfig.api.SENDER,
			text: this.text,
			timestamp: timestamp
		};

		var signature = this._hashSMSObject(this._sortAndConcatObject(objToSend) + smsConfig.api.API_KEY);

		objToSend.return = 'json';

		return smsConfig.api.BASE_URL + 'get/send.php?'
			+ "timestamp=" + objToSend["timestamp"] + "&"
			+ "login=" + objToSend["login"] + "&"
			+ "signature=" + signature + "&"
			+ "phone=" + objToSend["phone"] + "&"
			+ "text=" + objToSend["text"] + "&"
			+ "sender=" + objToSend["sender"];
	}

	_sortAndConcatObject(smsObject) {
		var sortedArray = Object.keys(obj).sort(),
			string = '';

		for (var i = 0; i < sortedArray.length; i++) {
			string += obj[sortedArray[i]];
		}

		return string;
	}

	_createApiRequest(queryString) {
		return new Promise((resolve, request) => {
			request.get(queryString)
				.strictSSL(false)
				.set('Accept', 'application/json')
				.end(function (res) {
					if (error) {
						return reject(error);
					} else if (res.body && res.body.error) {
						return reject(new Error(res.body.error))
					} else {
						return resolve();
					}
				});
		});
	}

	sendSMS() {
		return this._getTimeStamp()
			.then(this._generateQueryString)
			.then(this._createApiRequest)
			.then(this._formSuccessResponse)
			.catch(this._formErrorResponse);
	}
}