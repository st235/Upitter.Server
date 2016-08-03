'use strict';

const BaseController = require('./baseController');
const ValidationUtils = require('../utils/validationUtils');
const _ = require('underscore');

const reportResponseModel = require('../models/response/reportReasonResponseModel');

class ReportsController extends BaseController {
	constructor(reportsManager) {
		super({ reportsManager });
	}

	_onBind() {
		super._onBind();
		this.create = this.create.bind(this);
		this.obtain = this.obtain.bind(this);
		this.obtainReasons = this.obtainReasons.bind(this);
	}

	_onCreate() {
		super._onCreate();
		this.validationUtils = new ValidationUtils;
	}

	create(req, res, next) {

	}

	obtain(req, res, next) {

	}

	obtainReasons(req, res, next) {
		const invalid = this.validate(req)
			.add('reportType').should.exist().and.have.type('String')
			.validate();

		if (invalid) return next(invalid.name);

		const language = req.ln;
		const { reportType } = req.params;

		this
			.reportsManager
			.obtainReportReasons(reportType, language)
			.then(reasons => _.map(reasons, reason => reportResponseModel(reason, language)))
			.then(reasons => this.success(res, reasons))
			.catch(next);
	}
}

module.exports = ReportsController;
