'use strict';

const BaseController = require('./baseController');
const ValidationUtils = require('../utils/validationUtils');

const commentResponse = require('../models/response/commentResponseModel');

class CommentsController extends BaseController {
	constructor(commentsManager) {
		super({ commentsManager });
	}

	_onBind() {
		super._onBind();
		this.addComment = this.addComment.bind(this);
		this.editComment = this.editComment.bind(this);
		this.removeComment = this.removeComment.bind(this);
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

		let comment;

		this
			.commentsManager
			.createComment(userId, replyTo, text)
			.then(currentComment => {
				comment = currentComment;
				return this.commentsManager.findPostComments(postId);
			})
			.then(postComments => {
				if (!postComments) return this.commentsManager.createAndUpdatePostComments(comment, postId);
				return this.commentsManager.updatePostComments(comment, postId);
			})
			.then(() => this.success(res, commentResponse(comment)))
			.catch(next);
	}

	editComment(req, res, next) {
		const invalid = this.validate(req)
			.add('postId').should.exist().and.have.type('String')
			.add('commentId').should.exist().and.have.type('String')
			.add('text').should.exist().and.have.type('String').and.be.in.rangeOf(3, 400)
			.validate();

		if (invalid) return next(invalid.name);

		const { userId } = req;
		const { text, postId, replyTo, commentId } = req.body;

		let comment;

		this
			.commentsManager
			.editComment(userId, replyTo, text, commentId)
			.then(currentComment => {
				comment = currentComment;
				return this.commentsManager.editPostComments(comment, postId);
			})
			.then(() => this.success(res, commentResponse(comment)))
			.catch(next);
	}

	removeComment(req, res, next) {
		const invalid = this.validate(req)
			.add('postId').should.exist().and.have.type('String')
			.add('commentId').should.exist().and.have.type('String')
			.validate();

		if (invalid) return next(invalid.name);

		const { userId } = req;
		const { postId, commentId } = req.body;

		let comment;

		this
			.commentsManager
			.removeComment(userId, commentId)
			.then(currentComment => {
				comment = currentComment;
				return this.commentsManager.removeFromPostComments(comment, postId);
			})
			.then(() => this.success(res, commentResponse(comment)))
			.catch(next);
	}
}

module.exports = CommentsController;
