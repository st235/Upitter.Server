'use strict';

const _ = require('underscore');
const AppUnit = require('../app/unit');

const commentResponse = require('../models/response/commentResponse');

class CommentsManager extends AppUnit {
	constructor(commentsModel) {
		super({ commentsModel });
	}

	_onBind() {
		this.create = this.create.bind(this);
		this.remove = this.remove.bind(this);
		this.obtain = this.obtain.bind(this);
	}

	create(userId, data) {
		data.createdDate = Date.now();
		data.author = userId;
		const comment = new this.commentsModel(data);
		return comment.save()
			.then(comment => commentResponse(comment))
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	remove(commentId) {
		return this
			.commentsModel
			.findOneAndUpdate({ customId: commentId }, { isRemoved: true }, { new: true })
			.then(comment => comment.customId)
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	obtain(limit = 20, offset) {
		return this
			.commentsModel
			.getComents(limit, offset)
			.then(comments => {
				if (!comments) return [];
				return _.map(comments, (comment) => commentResponse(comment));
			})
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}
}

module.exports = CommentsManager;
