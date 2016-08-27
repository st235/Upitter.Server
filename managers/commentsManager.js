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
	}

	create(author, postId, replyTo, text) {
		const comment = new this.commentModel({ author, postId, replyTo, text, createdDate: Date.now() });
		return comment
			.save()
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	edit(author, replyTo, text, commentId) {
		return this
			.commentModel
			.findOne({ customId: parseInt(commentId, 10) })
			.then(comment => {
				if (!comment || comment.author !== author.toString()) throw 'INTERNAL_SERVER_ERROR'; //TODO переделать ошибки
				if (Date.parse(comment.createdDate) + 900000 < new Date()) throw 'INTERNAL_SERVER_ERROR';
				_.extend(comment, { text, replyTo });
				return comment.save();
			})
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	remove(author, commentId) {
		return this
			.commentModel
			.findOne({ customId: commentId })
			.exec()
			.then(comment => {
				if (!comment || comment.author !== author.toString()) throw 'INTERNAL_SERVER_ERROR';
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
}

module.exports = CommentsManager;
