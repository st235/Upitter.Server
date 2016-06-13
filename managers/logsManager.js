'use strict';

class LogsManager {
	constructor(logsModel) {
		this.logsModel = logsModel;

		this.logSave = this.logSave.bind(this);
		this.getLogs = this.getLogs.bind(this);
	}

	logSave(data) {
		const log = new this.logsModel(data);
		console.log(data);
		return log.save();
	}

	getLogs(data) {
		
	}
}

module.exports = LogsManager;