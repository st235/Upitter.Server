'use strict';

class LogsManager {
	constructor(logsModel) {
		this.logsModel = logsModel;
		this.trySave = this.trySave.bind(this);
		this.getLogs = this.getLogs.bind(this);
	}

	trySave(logId, systemType, log) {
		const data = { logId, systemType, log };

		return this
			.logsModel
			.findUnique(logId, systemType)
			.then(log => {
				if (log) throw new Error(500);
				const model = new this.logsModel(data);
				return model.save();
			});
	}

	getLogs(limit = 20, offset) {
		return this
			.logsModel
			.getLogs(limit, offset)
			.then(logs => {
				if (!logs) throw new Error(500);
				return logs;
			});
	}
}

module.exports = LogsManager;
