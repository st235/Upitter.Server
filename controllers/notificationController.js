'use strict';

const BaseController = require('./baseController');
const _ = require('underscore');

const notificationResponseModel = require('../models/response/notificationResponseModel');

class NotificationController extends BaseController {
	constructor(notificationManager) {
		super({
			notificationManager
		});
	}

	_onBind() {
		super._onBind();
		this.obtainNotifications = this.obtainNotifications.bind(this);
	}

	_onCreate() {
		super._onCreate();
	}

	obtainNotifications(req, res, next) {
		const { userId, ln } = req;
		const { limit = 20, notificationId, type } = req.query;

		this
			.notificationManager
			.obtain(limit, userId, type, notificationId)
			.then(notifications => _.map(notifications, notification => notificationResponseModel(notification, ln)))
			.then(result => this.success(res, result))
			.catch(next);
	}
}

module.exports = NotificationController;
