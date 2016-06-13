'use strict';

class FeedbacksManager {
	constructor(feedbacksModel) {
		this.feedbacksModel = feedbacksModel;
		this.trySave = this.trySave.bind(this);
		this.getFeedbacks = this.getFeedbacks.bind(this);
	}

	trySave(userId, message) {
		const data = { userId, message };
		const feedback = new this.feedbacksModel(data);
		return feedback.save();
	}

	getFeedbacks(limit = 20, offset) {
		return this
			.feedbacksModel
			.getFeedbacks(limit, offset)
			.then(feedbacks => {
				if (!feedbacks) throw new Error(500);
				return feedbacks;
			});
	}

}

module.exports = FeedbacksManager;
