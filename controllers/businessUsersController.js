'use strict';

const BaseController = require('./baseController');
const ValidationUtils = require('../utils/validationUtils');
const businessUserResponse = require('../models/response/businessUserResponse');

class BusinessUsersController extends BaseController {
	constructor(businessUsersManager) {
		super({ businessUsersManager });
	}

	_onBind() {
		super._onBind();
		this.edit = this.edit.bind(this);
		this.getSubscribers = this.getSubscribers.bind(this);
	}

	_onCreate() {
		this.validationUtils = new ValidationUtils;
	}

	edit(req, res, next) {
		//TODO: Доделать
		this
			.businessUsersManager
			.edit(req.userId, req.body)
			.then(businessUser => this.success(res, businessUser))
			.catch(next);
	}

	getSubscribers(req, res) {
		this
			.businessUsersManager
			.getSubscribers(req.userId)
			.then(company => businessUserResponse(company))
			.then(response => this.success(res, response))
			.catch(next);
	}
}

module.exports = BusinessUsersController;
