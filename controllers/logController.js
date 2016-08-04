'use strict';

const BaseController = require('./baseController');
const ValidationUtils = require('../utils/validationUtils');

class LogsController extends BaseController {
	constructor(logsManager) {
		super({ logsManager });
	}

	_onBind() {
		super._onBind();
		this.log = this.log.bind(this);
		this.getLogs = this.getLogs.bind(this);
	}

	_onCreate() {
		super._onCreate();
		this.validationUtils = new ValidationUtils;
	}

	log(req, res) {
		const params = req.params;
		const body = req.body;

		const invalidBody = this.validationUtils.existAndTypeVerify(body, 'String', 'log');
		if (invalidBody) return this.error(res, invalidBody);

		this
			.logsManager
			.trySave(params.id, params.systemType, body.log)
			.then(log => this.success(res, log))
			.catch(error => this.error(res, error));
	}

	getLogs(req, res) {
		const query = req.query;

		this
			.logsManager
			.getLogs(query.limit, query.offset)
			.then(log => this.success(res, log))
			.catch(error => this.error(res, error));
	}
}

module.exports = LogsController;
