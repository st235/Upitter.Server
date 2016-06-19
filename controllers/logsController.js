'use strict';

const BaseController = require('./baseController');

class LogsController extends BaseController {
	constructor(logsManager) {
		super({ logsManager });
	}

	_onBind() {
		super._onBind();
		this.log = this.log.bind(this);
		this.getLogs = this.getLogs.bind(this);
	}

	log(req, res) {
		//  TODO add accessToken and validatron
		const params = req.params;
		const body = req.body;

		this
			.logsManager
			.trySave(params.id, params.systemType, body.log)
			.then(log => this.success(res, log))
			.catch(error => this.error(res, error));
	}

	getLogs(req, res) {
		//  TODO add accessToken and validatron
		const query = req.query;

		this
			.logsManager
			.getLogs(query.limit, query.offset)
			.then(log => this.success(res, log))
			.catch(error => this.error(res, error));
	}
}

module.exports = LogsController;
