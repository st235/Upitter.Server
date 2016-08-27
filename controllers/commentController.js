'use strict';

const BaseController = require('./baseController');
const ValidationUtils = require('../utils/validationUtils');
const _ = require('underscore');

const commentResponse = require('../models/response/commentResponseModel');

class CommentsController extends BaseController {
	constructor(commentsManager, usersManager) {
		super({
			commentsManager,
			usersManager
		});
	}

	_onBind() {
		super._onBind();
		this.addComment = this.addComment.bind(this);
		this.editComment = this.editComment.bind(this);
		this.removeComment = this.removeComment.bind(this);
		this.obtain = this.obtain.bind(this);
	}

	_onCreate() {
		super._onCreate();
		this.validationUtils = new ValidationUtils;
	}

	addComment(req, res, next) {
		const invalid = this.validate(req)
			.add('postId').should.exist().and.have.type('String')
			.add('text').should.exist().and.have.type('String').and.be.in.rangeOf(3, 400)
			.validate();

		if (invalid) return next(invalid.name);

		const { userId } = req;
		const { text, postId, replyTo } = req.body;
		let authorObjectId;

		this
			.usersManager
			.getObjectId(userId)
			.then(userObjectId => {
				authorObjectId = userObjectId;
				return replyTo ? this.usersManager.getObjectId(replyTo) : null;
			})
			.then(userObjectId => this.commentsManager.create(authorObjectId, postId, userObjectId, text))
			.then(comment => this.commentsManager.findById(comment.customId))
			.then(comment => this.success(res, commentResponse(comment)))
			.catch(next);
	}

	editComment(req, res, next) {
		const invalid = this.validate(req)
			.add('commentId').should.exist().and.have.type('String')
			.add('text').should.exist().and.have.type('String').and.be.in.rangeOf(3, 400)
			.validate();

		if (invalid) return next(invalid.name);

		const { userId } = req;
		const { text, replyTo, commentId } = req.body;
		let authorObjectId;

		this
			.usersManager
			.getObjectId(userId)
			.then(userObjectId => {
				authorObjectId = userObjectId;
				return replyTo ? this.usersManager.getObjectId(replyTo) : null;
			})
			.then(userObjectId => this.commentsManager.edit(authorObjectId, userObjectId, text, commentId))
			.then(comment => this.commentsManager.findById(comment.customId))
			.then(comment => this.success(res, commentResponse(comment)))
			.catch(next);
	}

	removeComment(req, res, next) {
		const invalid = this.validate(req)
			.add('commentId').should.exist().and.have.type('String')
			.validate();

		if (invalid) return next(invalid.name);

		const { userId } = req;
		const { commentId } = req.body;

		this
			.usersManager
			.getObjectId(userId)
			.then(userObjectId => this.commentsManager.remove(userObjectId, commentId))
			.then(comment => comment.isRemoved ? { removed: true } : this.commentsManager.findById(comment.customId))
			.then(result => result.removed ? this.success(res, result) : this.success(res, commentResponse(result)))
			.catch(next);
	}

	obtain(req, res, next) {
		const invalid = this.validate(req)
			.add('postId').should.exist().and.have.type('String')
			.validate();

		if (invalid) return next(invalid.name);

		const { limit = 20, postId, commentId, type } = req.query;

		this
			.commentsManager
			.obtain(limit, postId, commentId, type)
			.then(comments => _.map(comments, comment => commentResponse(comment)))
			.then(response => this.success(res, { comments: response }))
			.catch(next);
	}
}

module.exports = CommentsController;
