'use strict';

const BaseController = require('./baseController');
const ValidationUtils = require('../utils/validationUtils');

class BusinessUsersController extends BaseController {
	constructor(businessUsersManager) {
		super({ businessUsersManager });
	}

	_onBind() {
		super._onBind();
		this.edit = this.edit.bind(this);
	}

	_onCreate() {
		this.validationUtils = new ValidationUtils;
	}

	edit(req, res) {
		//TODO: Доделать
		this
			.businessUsersManager
			.edit(req.userId, req.body)
			.catch(next)
			.then(businessUser => this.success(res, businessUser))
	}
}

module.exports = BusinessUsersController;
