'use strict';

const AppUnit = require('../app/unit');
const reportsConfig = require('../config/reportReasons');
const _ = require('underscore');

class ReportsManager extends AppUnit {
	constructor(reportModel, reportReasonModel) {
		super({ reportModel, reportReasonModel });
	}

	_onBind() {
		this._createReason = this._createReason.bind(this);
		this.createDefaultReportReasons = this.createDefaultReportReasons.bind(this);
		this.obtainReportReasons = this.obtainReportReasons.bind(this);
		this.obtainReports = this.obtainReports.bind(this);
		this.obtainReportsByType = this.obtainReportsByType.bind(this);
		this.obtainAllReports = this.obtainAllReports.bind(this)

	}

	_createReason(data, customId, type) {
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
				_.each(reportReasons, (data, customId) => this._createReason(data, customId, reportType))
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

	create(author, type, reason, companyId, commentId, postId) {
		const data = Object.assign(
			{ author },
			{ type },
			{ reason },
			{ companyId },
			{ commentId },
			{ postId },
			{ createdDate: Date.now() }
		);
		const report = this.reportModel(data);
		return report
			.save()
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	obtainReports(type) {
		return type ? this.obtainReportsByType(type) : this.obtainAllReports();
	}

	obtainReportsByType(type) {
		return this
			.reportModel
			.find({ type })
			.exec()
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	obtainAllReports() {
		return this
			.reportModel
			.find()
			.exec()
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

}

module.exports = ReportsManager;

