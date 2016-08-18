'use strict';

const BaseController = require('./baseController');
const ValidationUtils = require('../utils/validationUtils');
const _ = require('underscore');

const pagingConfig = require('../config/pagingConfig');
const reportResponse = require('../models/response/reportResponseModel');
const companyResponse = require('../models/response/companyResponseModel');
const postResponse = require('../models/response/postResponseModel');
const commentResponse = require('../models/response/commentResponseModel');

class ReportsController extends BaseController {
	constructor(reportsManager, usersManager, postsManager, companiesManager, commentsManager) {
		super({
			reportsManager,
			usersManager,
			postsManager,
			companiesManager,
			commentsManager
		});
	}

	_onBind() {
		super._onBind();
		this.create = this.create.bind(this);
		this.obtainReports = this.obtainReports.bind(this);
		this.obtainReasons = this.obtainReasons.bind(this);
		this.obtainTargetOfReport = this.obtainTargetOfReport.bind(this);
	}

	_onCreate() {
		super._onCreate();
		this.validationUtils = new ValidationUtils;
	}

	create(req, res, next) {
		const invalid = this.validate(req)
			.add('reasonId').should.exist().and.have.type('String')
			.add('targetId').should.exist().and.have.type('String')
			.validate();

		if (invalid) return next(invalid.name);

		const { userId } = req;
		const { reasonId, targetId } = req.body;
		let currentAuthor;

		this
			.usersManager
			.findById(userId)
			.then(author => {
				currentAuthor = _.pick(author, 'customId', 'nickname');
				return this.reportsManager.findReasonById(reasonId);
			})
			.then(reason => {
				const currentReason = _.pick(reason, 'customId', 'title');
				const type = reason.type;
				return this.reportsManager.create(currentAuthor, type, currentReason, targetId);
			})
			.then(report => reportResponse(report))
			.then(report => this.success(res, report))
			.catch(next);
	}

	obtainReports(req, res, next) {
		const invalid = this.validate(req)
			.add('page').should.exist().and.have.type('String')
			.validate();

		if (invalid) return next(invalid.name);

		const { type, page } = req.query;
		const limit = pagingConfig.reports.limit;
		const offset = page * limit - pagingConfig.reports.offset;

		this
			.reportsManager
			.obtainReports(type, limit, offset)
			.then(reports => _.map(reports, report => reportResponse(report)))
			.then(reports => this.success(res, reports))
			.catch(next);
	}

	obtainReasons(req, res, next) {
		const invalid = this.validate(req)
			.add('type').should.exist().and.have.type('String')
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
	//TODO исправить ошибки и переделать так, чтобы искалось по Id репорта
	obtainTargetOfReport(req, res, next) {
		const invalid = this.validate(req)
			.add('type').should.exist().and.have.type('String')
			.add('targetId').should.exist().and.have.type('String')
			.validate();

		if (invalid) return next(invalid.name);

		const { type, targetId } = req.params;
		switch (type) {
		case 'post':
			this
				.postsManager
				.findById(targetId)
				.then(({ post, author }) => {
					const company = companyResponse(author);
					return postResponse(req.userId, post, req.ln, company);
				})
				.then(response => this.success(res, response))
				.catch(next);
			break;
		case 'company':
			this
				.companiesManager
				.findById(targetId)
				.then(company => this.success(res, companyResponse(company)))
				.catch(next);
			break;
		case 'comment':
			this
				.commentsManager
				.findComment(targetId)
				.then(comment => this.success(res, commentResponse(comment)))
				.catch(next);
			break;
		default:
			next('INTERNAL_SERVER_ERROR');
			break;
		}
	}
}

module.exports = ReportsController;
