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
		console.log(data);
		const comment = new this.commentsModel(data);
		return comment.save().then(comment => {
			if (!comment) throw new Error(500);
			return commentResponse(comment);
		});
	}

	remove(commentId) {
		return this
			.commentsModel
			.findOneAndUpdate({ customId: commentId }, { isRemoved: true }, { new: true })
			.then(comment => comment.save())
			.then(comment => comment.customId);
	}

	obtain(limit = 20, offset) {
		return this
			.commentsModel
			.getComents(parseInt(limit), parseInt(offset))
			.then(comments => {
				if (!comments) throw new Error(500);
				return _.map(comments, (comment) => commentResponse(comment));
			});
	}
}

module.exports = CommentsManager;
