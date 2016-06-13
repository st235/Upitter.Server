'use strict';

const BaseController = require('./baseController');

class LogsController extends BaseController {
	constructor(logsManager) {
		super();
		this.logsManager = logsManager;

		this.androidLogSave = this.androidLogSave.bind(this);
		this.iosLogSave = this.iosLogSave.bind(this);
		//this.getLogs = this.getLogs(this);
	}

	androidLogSave(req, res) {
		const data = req.body;
		data.systemType = 0;

		this.logsManager
			.logSave(data)
			.then(log => this.success(res, log))
			.catch(error => this.error(res, error));
	}

	iosLogSave(req, res) {
		const data = req.body;
		data.systemType = 1;

		this.logsManager
			.logSave(data)
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