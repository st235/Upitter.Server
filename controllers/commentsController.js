'use strict';

const BaseController = require('./baseController');
const ValidationUtils = require('../utils/validationUtils');

class CommentsController extends BaseController {
	constructor(commentsManager) {
		super({ commentsManager });
	}

	_onBind() {
		super._onBind();
		this.create = this.create.bind(this);
		this.remove = this.remove.bind(this);
		this.obtain = this.obtain.bind(this);
	}

	_onCreate() {
		super._onCreate();
		this.validationUtils = new ValidationUtils;
	}

	create(req, res) {
		const invalid = this.validate(req)
			.add('accessToken').should.exist().and.have.type('String')
			.add('text').should.exist().and.have.type('String').and.be.in.rangeOf(3, 400)
			.validate();

		if (invalid) return next(invalid.name);

		const body = req.body;

		this
			.commentsManager
			.create(req.userId, body)
			.then(comment => this.success(res, comment))
			.catch(next);
	}

	remove(req, res, next) {
		const invalid = this.validate(req)
			.add('accessToken').should.exist().and.have.type('String')
			.add('postId').should.exist().and.have.type('String')
			.validate();

		if (invalid) return next(invalid.name);

		const postId = req.query.customId;

		this
			.commentsManager
			.remove(postId)
			.then(removedId => this.success(res, removedId))
			.catch(next);
	}

	obtain(req, res, next) {
		const invalid = this.validate(req)
			.add('limit').should.exist().and.have.type('String')
			.add('offset').should.exist().and.have.type('String')
			.validate();

		if (invalid) return next(invalid.name);

		let { limit, offset } = req.query;
		try {
			limit = parseInt(limit);
			offset = parseInt(offset);
		} catch (e) {
			return next('PROPERTY_HAS_INCORRECT_TYPE');
		}

		this
			.commentsManager
			.obtain(limit, offset)
			.then(comments => this.success(res, comments))
			.catch(next);
	}
}

module.exports = CommentsController;
