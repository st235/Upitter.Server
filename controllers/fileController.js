'use strict';

const BaseController = require('./baseController');
const ValidationUtils = require('../utils/validationUtils');
const requestUtils = require('../services/requestService');

const domainConfig = require('../config/domain');
const routesConfig = require('../config/routes');

const _ = require('underscore');

class FileController extends BaseController {
	_onBind() {
		super._onBind();

		this.getFileInfoByFid = this.getFileInfoByFid.bind(this);
	}

	_onCreate() {
		super._onCreate();
		this.validationUtils = new ValidationUtils;
	}

	getFileInfoByFid(req, res, next) {
		const invalid = this.validate(req)
			.add('name').should.exist().and.have.type('String')
			.validate();

		if (invalid) return next(invalid.name);

		const uuid = req.userId;
		const { fid } = req.params;

		requestUtils.post(`${domainConfig.fileServerUrl}${routesConfig.external.verifyFid}`, {}, { uuid, fid })
			.then(result => {
				console.log(result);
			});
	}
}

module.exports = FileController;
