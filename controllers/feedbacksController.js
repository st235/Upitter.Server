'use strict';

const BaseController = require('./baseController');
const RedisService = require('../services/redisService');

class FeedbacksController extends BaseController {
	constructor(feedbacksManager) {
		super();
		this.authorizationClient = RedisService.getClientByName('authorizations');
		this.feedbacksManager = feedbacksManager;

		this.feedback = this.feedback.bind(this);
		this.getFeedbacks = this.getFeedbacks.bind(this);
	}

	feedback(req, res) {
		const accessToken = req.query.accessToken || req.body.accessToken;
		this
			.authorizationClient
			.get(accessToken)
			.then(userId => this.feedbacksManager.trySave(userId, req.body.message))
			.then(feedback => this.success(res, feedback))
			.catch(error => this.error(res, error));
	}

	getFeedbacks(req, res) {
		const query = req.query;
		this
			.feedbacksManager
			.getFeedbacks(query.limit, query.offset)
			.then(feedbacks => this.success(res, feedbacks))
			.catch(error => this.error(res, error));
	}

}

module.exports = FeedbacksController;
