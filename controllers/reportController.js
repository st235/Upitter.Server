'use strict';

const BaseController = require('./baseController');
const ValidationUtils = require('../utils/validationUtils');
const _ = require('underscore');

const reportResponseModel = require('../models/response/reportResponseModel');

class ReportsController extends BaseController {
	constructor(reportsManager) {
		super({ reportsManager });
	}

	_onBind() {
		super._onBind();
		this.create = this.create.bind(this);
		this.obtainReports = this.obtainReports.bind(this);
		this.obtainReasons = this.obtainReasons.bind(this);
	}

	_onCreate() {
		super._onCreate();
		this.validationUtils = new ValidationUtils;
	}

	create(req, res, next) {
		const invalid = this.validate(req)
			.add('type').should.exist().and.have.type('String')
			.add('reason').should.exist().and.have.type('String')
			.validate();

		if (invalid) return next(invalid.name);

		const author = req.userId;
		const { type } = req.params;
		const { reason, targetId } = req.body;

		let companyId;
		let commentId;
		let postId;

		switch (type) {
		case 'company':
			companyId = targetId;
			break;
		case 'comment':
			commentId = targetId;
			break;
		case 'post':
			postId = targetId;
			break;
		default:
			return next('INCORRECT_REPORT_TYPE');
		}

		this
			.reportsManager
			.create(author, type, reason, companyId, commentId, postId)
			.then(report => reportResponseModel(report))
			.then(report => this.success(res, report))
			.catch(next);
	}

	obtainReports(req, res, next) {
		const { type } = req.query;

		this
			.reportsManager
			.obtainReports(type)
			.then(reports => _.map(reports, report => reportResponseModel(report)))
			.then(reports => this.success(res, reports))
			.catch(next);
	}

	obtainReasons(req, res, next) {
		const invalid = this.validate(req)
			.add('reportType').should.exist().and.have.type('String')
			.validate();

		if (invalid) return next(invalid.name);

		const language = req.ln;
		const { type } = req.params;

		this
			.reportsManager
			.obtainReportReasons(type, language)
			.then(reasons => _.map(reasons, reason => reportResponseModel(reason, language)))
			.then(reasons => this.success(res, reasons))
			.catch(next);
	}
}

module.exports = ReportsController;
