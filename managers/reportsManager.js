'use strict';

const AppUnit = require('../app/unit');
const reportsConfig = require('../config/reportReasons');
const _ = require('underscore');

class ReportsManager extends AppUnit {
	constructor(reportModel, reportReasonModel) {
		super({ reportModel, reportReasonModel });
	}

	_onBind() {
		this._create = this._create.bind(this);
		this.createDefaultReportReasons = this.createDefaultReportReasons.bind(this);
		this.obtainReportReasons = this.obtainReportReasons.bind(this);
	}

	_create(data, customId, type) {
		Object.assign(data, { customId }, { type });
		const reason = this.reportReasonModel(data);
		return reason.save()
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	createDefaultReportReasons() {
		this
			.reportReasonModel
			.remove({})
			.then(_.each(reportsConfig, (reportReasons, reportType) =>
				_.each(reportReasons, (data, customId) => this._create(data, customId, reportType))
			))
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	obtainReportReasons(type) {
		return this
			.reportReasonModel
			.find({ type })
			.exec()
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}
}

module.exports = ReportsManager;
