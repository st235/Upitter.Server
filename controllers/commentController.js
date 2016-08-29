'use strict';

const BaseController = require('./baseController');
const ValidationUtils = require('../utils/validationUtils');
const _ = require('underscore');

const commentResponse = require('../models/response/commentResponseModel');

class CommentsController extends BaseController {
	constructor(commentsManager, usersManager, companiesManager) {
		super({
			commentsManager,
			usersManager,
			companiesManager
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

		Promise
			.resolve(userId > 0 ? this.usersManager.getObjectId(userId) : this.companiesManager.getObjectId(userId))
			.then(userObjectId => {
				authorObjectId = userObjectId;
				if (replyTo) {
					return parseInt(replyTo, 10) > 0 ? this.usersManager.getObjectId(replyTo) : this.companiesManager.getObjectId(replyTo);
				} else {
					return null;
				}
			})
			.then(userObjectId => this.commentsManager.create(authorObjectId, userId, postId, userObjectId, replyTo, text))
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

		Promise
			.resolve(userId > 0 ? this.usersManager.getObjectId(userId) : this.companiesManager.getObjectId(userId))
			.then(userObjectId => {
				authorObjectId = userObjectId;
				if (replyTo) {
					return parseInt(replyTo, 10) > 0 ? this.usersManager.getObjectId(replyTo) : this.companiesManager.getObjectId(replyTo);
				} else {
					return null;
				}
			})
			.then(userObjectId => this.commentsManager.edit(authorObjectId, userId, userObjectId, replyTo, text, commentId))
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
		Promise
			.resolve(userId > 0 ? this.usersManager.getObjectId(userId) : this.companiesManager.getObjectId(userId))
			.then(userObjectId => this.commentsManager.remove(userObjectId, userId, commentId))
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
		let currentComments;

		this
			.commentsManager
			.obtain(limit, postId, commentId, type)
			.then(comments => _.map(comments, comment => commentResponse(comment)))
			.then(comments => {
				currentComments = comments;
				return this.commentsManager.count(postId);
			})
			.then(amount => this.success(res, { amount, comments: currentComments }))
			.catch(next);
	}
}

module.exports = CommentsController;
