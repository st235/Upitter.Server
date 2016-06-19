'use strict';

const request = require('unirest');
const crypto = require('crypto');
const _ = require('underscore');
const smsConfig = require('../../config/smsProvider/sms16');

class SMS16Strategy {
	_formSuccessResponse(response) {
		return response;
	}

	_formErrorResponse(error) {
		throw error;
	}

	constructor(code, phone, text) {
		this.code = code;
		this.phone = phone;
		this.text = text;

		this._bind();
	}

	static init(code, phone, text) {
		return new this(code, phone, text);
	}

	_bind() {
		this._formSuccessResponse = this._formSuccessResponse.bind(this);
		this._formErrorResponse = this._formErrorResponse.bind(this);
		this._clear = this._clear.bind(this);
		this._hashSMSObject = this._hashSMSObject.bind(this);
		this._getTimeStamp = this._getTimeStamp.bind(this);
		this._generateQueryString = this._generateQueryString.bind(this);
		this._sortAndConcatObject = this._sortAndConcatObject.bind(this);
		this._createApiRequest = this._createApiRequest.bind(this);
		this.sendSMS = this.sendSMS.bind(this);
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
				.get(`${smsConfig.api.BASE_URL}get/timestamp.php`)
				.strictSSL(false)
				.end(res => {
					if (res && res.status === 200) {
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
			timestamp
		};

		var signature = this._hashSMSObject(`${this._sortAndConcatObject(objToSend)}${smsConfig.api.API_KEY}`);

		objToSend.return = 'json';

		const result =  smsConfig.api.BASE_URL + 'get/send.php?'
			+ "timestamp=" + objToSend["timestamp"] + "&"
			+ "login=" + objToSend["login"] + "&"
			+ "signature=" + signature + "&"
			+ "phone=" + objToSend["phone"] + "&"
			+ "text=" + objToSend["text"] + "&"
			+ "sender=" + objToSend["sender"];
		return result;
	}

	_sortAndConcatObject(smsObject) {
		var sortedArray = Object.keys(smsObject).sort(),
			string = '';

		for (var i = 0; i < sortedArray.length; i++) {
			string += smsObject[sortedArray[i]];
		}

		return string;
	}

	_createApiRequest(queryString) {
		this._clear();
		return new Promise((resolve, reject) => {
			request
				.get(queryString)
				.strictSSL(false)
				.set('Accept', 'application/json')
				.end(res => {
					if (res && res.status === 200) {
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

	sendSMS() {
		return this._getTimeStamp()
			.then(this._generateQueryString)
			.then(this._createApiRequest)
			.then(this._formSuccessResponse)
			.catch(this._formErrorResponse);
	}
}

module.exports = SMS16Strategy;