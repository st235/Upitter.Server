'use strict';

const AppUnit = require('../app/unit');
const reportsConfig = require('../config/reportReasons');
const _ = require('underscore');

class ReportsManager extends AppUnit {
	constructor(reportModel, reportReasonModel) {
		super({
			reportModel,
			reportReasonModel
		});
	}

	_onBind() {
		this._createReason = this._createReason.bind(this);
		this.createDefaultReportReasons = this.createDefaultReportReasons.bind(this);
		this.obtainReportReasons = this.obtainReportReasons.bind(this);
		this.obtainReports = this.obtainReports.bind(this);
		this.obtainReportsByType = this.obtainReportsByType.bind(this);
		this.obtainAllReports = this.obtainAllReports.bind(this);
		this.findReasonById = this.findReasonById.bind(this);

	}

	_createReason(data, customId, type) {
		Object.assign(data, { customId }, { type });
		const reason = new this.reportReasonModel(data);
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
		const query = type === "all" ? {} : { type };
		return this
			.reportReasonModel
			.find(query)
			.exec()
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	create(author, type, reason, targetId) {
		const data = {
			author,
			type,
			reason,
			targetId,
			createdDate: Date.now()
		};

		const report = new this.reportModel(data);

		return report
			.save()
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	obtainReports(type, limit, offset) {
		return type ? this.obtainReportsByType(limit, offset, type) : this.obtainAllReports(limit, offset);
	}

	obtainReportsByType(limit, offset, type) {
		return this
			.reportModel
			.find({ type })
			.sort({ createdDate: -1 })
			.limit(limit)
			.skip(offset)
			.exec()
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	obtainAllReports(limit, offset) {
		return this
			.reportModel
			.find()
			.sort({ createdDate: -1 })
			.limit(limit)
			.skip(offset)
			.exec()
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	findReasonById(reasonId) {
		return this
			.reportReasonModel
			.findOne({ customId: reasonId })
			.exec()
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}
}

module.exports = ReportsManager;
