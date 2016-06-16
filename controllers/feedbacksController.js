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
		this
			.feedbacksManager
			.trySave(req.userId, req.body.message)
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
