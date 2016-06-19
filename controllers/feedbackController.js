'use strict';

const BaseController = require('./baseController');

class FeedbackController extends BaseController {
	constructor(feedbackManager) {
		super();
		this.feedbacksManager = feedbackManager;

		this.feedback = this.feedback.bind(this);
		this.getFeedback = this.getFeedback.bind(this);
	}

	feedback(req, res) {
		this
			.feedbacksManager
			.trySave(req.userId, req.body.message)
			.then(feedback => this.success(res, feedback))
			.catch(error => this.error(res, error));
	}

	getFeedback(req, res) {
		const query = req.query;
		this
			.feedbacksManager
			.getFeedback(query.limit, query.offset)
			.then(feedback => this.success(res, feedback))
			.catch(error => this.error(res, error));
	}

}

module.exports = FeedbackController;
