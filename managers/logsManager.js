'use strict';

const AppUnit = require('../app/unit');

class LogsManager extends AppUnit {
	constructor(logModel) {
		super({ logModel });
	}

	_onBind() {
		this.trySave = this.trySave.bind(this);
		this.getLogs = this.getLogs.bind(this);
	}

	trySave(logId, systemType, log) {
		const data = { logId, systemType, log, createdDate: Date.now() };

		return this
			.logModel
			.findUnique(logId, systemType)
			.then(log => {
				if (log) throw new Error(500);
				const model = new this.logModel(data);
				return model.save();
			});
	}

	getLogs(limit = 20, offset) {
		let logsObject;

		return this
			.logModel
			.getLogs(parseInt(limit, 10), parseInt(offset, 10))
			.then(logs => {
				if (!logs) throw new Error(500);
				logsObject = logs;
				return this.logModel.count();
			})
			.then(count => {
				const oSet = count - offset - logsObject.length;
				return { offset: oSet, items: logsObject };
			});
	}
}

module.exports = LogsManager;
