'use strict';

const AppUnit = require('../app/unit');
const reportsConfig = require('../config/reportReasons');
const _ = require('underscore');

class ReportsManager extends AppUnit {
	constructor(reportModel, reportReasonModel, companyModel, commentModel, postModel) {
		super({
			reportModel,
			reportReasonModel,
			companyModel,
			commentModel,
			postModel
		});
	}

	_onBind() {
		this._createReason = this._createReason.bind(this);
		this.createDefaultReportReasons = this.createDefaultReportReasons.bind(this);
		this.create = this.create.bind(this);
		this.checkReportByThisUser = this.checkReportByThisUser.bind(this);
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
		const query = type === 'all' ? null : { type };

		return this
			.reportReasonModel
			.find(query)
			.exec()
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	checkReportByThisUser(userId, type, targetId) {
		switch (type) {
		case 'post':
			return this
				.postModel
				.findOne({ customId: targetId })
				.exec()
				.then(post => {
					if (!post) throw 'INTERNAL_SERVER_ERROR';
					const find = !_.find(post.reportVoters, reportVoter => reportVoter === userId);
					if (find) post.reportVoters.push(userId);
					else throw 'REPORT_ERROR_2';
					return post.save();
				});
			break;
		case 'company':
			return this
				.companyModel
				.findOne({ customId: targetId })
				.exec()
				.then(company => {
					if (!company) throw 'INTERNAL_SERVER_ERROR';
					const find = !_.find(company.reportVoters, reportVoter => reportVoter === userId);
					if (find) company.reportVoters.push(userId);
					else throw 'REPORT_ERROR_1';
					return company.save();
				});
			break;
		case 'comment':
			return this
				.commentModel
				.findOne({ customId: targetId })
				.exec()
				.then(comment => {
					if (!comment) throw 'INTERNAL_SERVER_ERROR';
					const find = !_.find(comment.reportVoters, reportVoter => reportVoter === userId);
					if (find) comment.reportVoters.push(userId);
					else throw 'REPORT_ERROR_3';
					return comment.save();
				});
			break;
		default:
			throw 'INTERNAL_SERVER_ERROR';
		}
	}

	create(author, type, reason, targetId) {
		const report = new this.reportModel({
			author,
			type,
			reason,
			targetId,
			createdDate: Date.now()
		});

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
