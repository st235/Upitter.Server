'use strict';

const BaseController = require('./baseController');
const userResponse = require('../models/response/userResponse');

class UsersController extends BaseController {
	constructor(usersManager) {
		super();
		this.usersManager = usersManager;

		this.edit = this.edit.bind(this);
	}
	edit(req, res) {
		this
			.usersManager
			.edit(req.userId, req.body)
			.then(user => userResponse(user))
			.then(response => this.success(res, response))
			.catch(error => this.error(res, error));
	}
}

module.exports = UsersController;
