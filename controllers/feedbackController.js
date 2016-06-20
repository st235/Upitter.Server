'use strict';

const BaseController = require('./baseController');
const ValidationUtils = require('../utils/validationUtils');

class FeedbackController extends BaseController {
	constructor(feedbackManager) {
		super({ feedbackManager });
	}

	_onBind() {
		super._onBind();
		this.feedback = this.feedback.bind(this);
		this.getFeedback = this.getFeedback.bind(this);
	}

	_onCreate() {
		this.validationUtils = new ValidationUtils;
	}

	feedback(req, res) {
		const body = req.body;

		const invalidBody = this.validationUtils.existAndTypeVerify(body, 'String', 'message');
		if (invalidBody) return this.error(res, invalidBody);

		this
			.feedbackManager
			.trySave(req.userId, body.message)
			.then(feedback => this.success(res, feedback))
			.catch(error => this.error(res, error));
	}

	getFeedback(req, res) {
		const query = req.query;
		const invalidQuery = this.validationUtils.typeVerify(query, 'Number', 'limit', 'offset');
		if (invalidQuery) return this.error(res, invalidQuery);

		this
			.feedbackManager
			.getFeedback(query.limit, query.offset)
			.then(feedback => this.success(res, feedback))
			.catch(error => this.error(res, error));
	}

}

module.exports = FeedbackController;
