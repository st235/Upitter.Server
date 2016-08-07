'use strict';

const async = require('async');
const request = require('superagent');
const requestService = require('../services/requestService');
const domainConfig = require('../config/domain');
const routesConfig = require('../config/routes');

module.exports = {
	getInfoByFidsArray(uuid, fids) {
		return new Promise((resolve, reject) => {
			async.map(fids, this.getInfoByFid.bind(this, uuid), (err, result) => {
				if (err) return reject('INTERNAL_SERVER_ERROR');
				return resolve(result);
			});
		});
	},

	getInfoByFid(uuid, fid, callback) {
		return request.get(`${domainConfig.fileServerUrl}${routesConfig.external.verifyFid}`)
			.query({ uuid, fid })
			.set('Accept', 'application/json')
			.end((err, res) => {
				if (err || !res.ok) callback(err);
				else callback(null, res.body.response);
			});
	}
};