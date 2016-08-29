'use strict';

const _ = require('underscore');
const AppUnit = require('../app/unit');

class CommentsManager extends AppUnit {
	constructor(commentModel, userModel) {
		super({
			commentModel,
			userModel
		});
	}

	_onBind() {
		this.create = this.create.bind(this);
		this.edit = this.edit.bind(this);
		this.remove = this.remove.bind(this);
		this.findById = this.findById.bind(this);
		this.obtain = this.obtain.bind(this);
		this.count = this.count.bind(this);
	}

	create(author, authorId, postId, replyTo, replyToId, text) {
		const authorUser = parseInt(authorId, 10) > 0 ? author : null;
		const authorCompany = parseInt(authorId, 10) < 0 ? author : null;
		const replyToUser = parseInt(replyToId, 10) > 0 ? replyTo : null;
		const replyToCompany = parseInt(replyToId, 10) < 0 ? replyTo : null;

		const comment = new this.
			commentModel({
				authorUser,
				authorCompany,
				replyToUser,
				replyToCompany,
				postId,
				text,
				createdDate: Date.now()
			});


		return comment
			.save()
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	edit(author, authorId, replyTo, replyToId, text, commentId) {
		return this
			.commentModel
			.findOne({ customId: parseInt(commentId, 10) })
			.then(comment => {
				if (!comment || authorId > 0 ? comment.authorUser !== author.toString() : comment.authorCompany !== author.toString()) throw 'INTERNAL_SERVER_ERROR'; //TODO переделать ошибки
				if (Date.parse(comment.createdDate) + 900000 < new Date()) throw 'INTERNAL_SERVER_ERROR';

				let replyToUser;
				let replyToCompany;
				if (replyTo && replyToId) {
					replyToUser = parseInt(replyToId, 10) > 0 ? replyTo : null;
					replyToCompany = parseInt(replyToId, 10) < 0 ? replyTo : null;
					_.extend(comment, { replyToUser, replyToCompany });
				}

				_.extend(comment, { text });
				return comment.save();
			})
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	remove(author, authorId, commentId) {
		return this
			.commentModel
			.findOne({ customId: commentId })
			.exec()
			.then(comment => {
				if (!comment || authorId > 0 ? comment.authorUser !== author.toString() : comment.authorCompany !== author.toString()) throw 'INTERNAL_SERVER_ERROR'; //TODO переделать ошибки
				if (Date.parse(comment.createdDate) + 900000 < new Date()) throw 'INTERNAL_SERVER_ERROR';
				comment.isRemoved = !comment.isRemoved;
				return comment.save();
			})
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	findById(commentId) {
		return this
			.commentModel
			.getCommentById(commentId)
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	obtain(limit, postId, commentId, type) {
		return this
			.commentModel
			.getComments(limit, postId, commentId, type)
			.then(comments => {
				if (!comments) throw 'INTERNAL_SERVER_ERROR';
				return comments;
			});
	}

	count(postId) {
		return this
			.commentModel
			.countComments(postId);
	}
}

module.exports = CommentsManager;
