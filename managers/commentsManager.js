'use strict';

const _ = require('underscore');
const AppUnit = require('../app/unit');

class CommentsManager extends AppUnit {
	constructor(commentModel, postCommentsModel, userModel, postModel) {
		super({ commentModel, postCommentsModel, userModel, postModel });
	}

	_onBind() {
		this.createComment = this.createComment.bind(this);
		this.findPostComments = this.findPostComments.bind(this);
		this.createAndUpdatePostComments = this.createAndUpdatePostComments.bind(this);
		this.updatePostComments = this.updatePostComments.bind(this);
		this.editComment = this.editComment.bind(this);
		this.editPostComments = this.editPostComments.bind(this);
		this.removeComment = this.removeComment.bind(this);
		this.removeFromPostComments = this.removeFromPostComments.bind(this);
	}

	createComment(userId, replyTo, text) {
		let currentAuthor;

		return this
			.userModel
			.findOne({ customId: userId })
			.then(author => {
				currentAuthor = author;
				if (replyTo) return this.userModel.findOne({ customId: replyTo });
			})
			.then(replyTo => {
				_.pick(currentAuthor, 'customId', 'nickname', 'picture');
				_.pick(replyTo, 'customId, nickname');
				const comment = new this.commentModel({ author: currentAuthor, text, replyTo, createdDate: Date.now() });
				return comment.save();
			})
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	findPostComments(postId) {
		return this
			.postCommentsModel
			.findOne({ postId })
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	createAndUpdatePostComments(comment, postId) {
		const comments = [];
		let postCommentsObjId;
		comments.push(comment);

		const postCommentsModel = new this.postCommentsModel({ postId, comments });

		postCommentsModel
			.save()
			.then(postComments => {
				postCommentsObjId = postComments._id;
				return this.postModel.findOne(postId);
			})
			.then(post => {
				post.comments = postCommentsObjId;
				return post.save();
			})
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	updatePostComments(comment, postId) {
		return this
			.postCommentsModel
			.findOne({ postId })
			.then(postComments => {
				postComments.comments.push(comment);
				return postComments.save();
			})
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	editComment(userId, replyTo, text, commentId) {
		let currentComment;

		return this
			.commentModel
			.findOne({ customId: commentId })
			.then(comment => {
				currentComment = comment;
				if (!comment || comment.author.customId !== parseInt(userId, 10)) throw 'INTERNAL_SERVER_ERROR';
				if (Date.parse(comment.createdDate) + 900000 < new Date()) throw 'INTERNAL_SERVER_ERROR';
				return (replyTo) ? this.userModel.findOne({ customId: replyTo }) : null;
			})
			.then(replyTo => {
				replyTo ? _.pick(replyTo, 'customId, nickname') : replyTo = { customId: null, nickname: null };
				_.extend(currentComment, { text, replyTo });
				const comment = new this.commentModel(currentComment);
				return comment.save();
			})
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	editPostComments(comment, postId) {
		let currentPostComments;

		return this
			.postCommentsModel
			.findOne({ postId })
			.then(postComments => {
				currentPostComments = postComments;
				return _.map(postComments.comments, currentComment => (currentComment.customId !== comment.customId) ? currentComment : comment);
			})
			.then(updatedComments => {
				currentPostComments.comments = updatedComments;
				return currentPostComments.save();
			})
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	removeComment(userId, commentId) {
		return this
			.commentModel
			.findOne({ customId: commentId })
			.then(comment => {
				if (!comment || comment.author.customId !== parseInt(userId, 10)) throw 'INTERNAL_SERVER_ERROR';
				if (Date.parse(comment.createdDate) + 900000 < new Date()) throw 'INTERNAL_SERVER_ERROR';
				comment.isRemoved = !comment.isRemoved;
				return comment.save();
			})
			.then()
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	removeFromPostComments(comment, postId) {
		let currentPostComments;

		return this
			.postCommentsModel
			.findOne({ postId })
			.then(postComments => {
				currentPostComments = postComments;
				return _.map(postComments.comments, currentComment => {
					if (currentComment.customId === comment.customId) currentComment.isRemoved = !currentComment.isRemoved;
					return currentComment;
				});
			})
			.then(updatedComments => {
				currentPostComments.comments = updatedComments;
				return currentPostComments.save();
			})
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}
}

module.exports = CommentsManager;
