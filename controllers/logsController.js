'use strict';

const BaseController = require('./baseController');
const ValidationUtils = require('../utils/validationUtils');

class LogsController extends BaseController {
	constructor(logsManager) {
		super({ logsManager });
	}

	_onBind() {
		super._onBind();
		this.log = this.log.bind(this);
		this.getLogs = this.getLogs.bind(this);
	}

	_onCreate() {
		this.validationUtils = new ValidationUtils;
	}

	log(req, res) {
		const params = req.params;
		const body = req.body;

		 if (this.validationUtils.stringVerify(params, 'id') || this.validationUtils.stringVerify(params, 'params.systemType') || this.validationUtils.stringVerify(body, 'log')) return this.error(res, 'сломалось к хуям')
		//const invalidParams = this.validationService.init(params)
		//	.add('id').should.exist().and.have.type('String')
		//	.add('systemType').should.exist().and.have.type('String')
		//	.validate();
		//
		//const invalidBody = this.validationService.init(body)
		//	.add('log').should.exist().and.have.type('String')
		//	.validate();

		//if (invalidParams || invalidBody) return this.error(res, invalidParams || invalidBody);

		this
			.logsManager
			.trySave(params.id, params.systemType, body.log)
			.then(log => this.success(res, log))
			.catch(error => this.error(res, error));
	}

	getLogs(req, res) {
		//  TODO add accessToken and validatron
		const query = req.query;

		this
			.logsManager
			.getLogs(query.limit, query.offset)
			.then(log => this.success(res, log))
			.catch(error => this.error(res, error));
	}
}

module.exports = LogsController;
