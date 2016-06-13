'use strict';

const BaseController = require('./baseController');

class FeedbacksController extends BaseController {
	constructor(feedbacksManager) {
		super();
		this.feedbacksManager = feedbacksManager;

		this.feedback = this.feedback.bind(this);
		this.getFeedbacks = this.getFeedbacks.bind(this);
	}

	feedback(req, res) {
		const body = req.body;
		//TODO брать userId из accessToken
		this
			.feedbacksManager
			.trySave(body.userId, body.message)
			.then(feedback => this.success(res, feedback))
			.catch(error => this.error(res, error));
	}

	getFeedbacks(req, res) {
		const query = req.query;

		this
			.feedbacksManager
			.getFeedbacks(parseInt(query.limit), parseInt(query.offset))
			.then(feedbacks => this.success(res, feedbacks))
			.catch(error => this.error(res, error));
	}

}

module.exports = FeedbacksController;
