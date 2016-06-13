'use strict';

const BaseController = require('./baseController');

class LogsController extends BaseController {
	constructor(logsManager) {
		super();
		this.logsManager = logsManager;

		this.log = this.log.bind(this);
		//this.getLogs = this.getLogs(this);
	}

	log(req, res) {
		const params = req.params;
		const body = req.body;

		this
			.logsManager
			.trySave(params.id, params.systemType, body.log)
			.then(log => this.success(res, log))
			.catch(error => this.error(res, error));
	}

	// getLogs(req, res) {
	// 	const data = req.query;
	//
	// 	this.logsManager
	// 		.getLogs(data)
	// 		.then(log => this.success(res, log))
	// 		.catch(error => this.error(res, error));
	// }
}

module.exports = LogsController;