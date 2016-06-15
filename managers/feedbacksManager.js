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
			.getFeedbacks(parseInt(limit), parseInt(offset))
			.then(feedbacks => {
				if (!feedbacks) throw new Error(500);
				return this.feedbacksModel.count().then(count => {
					const oSet = count - offset - feedbacks.length;
					return { offset: oSet, items: feedbacks };
				});
			});
	}
}

module.exports = FeedbacksManager;
