'use strict';

const BaseController = require('./baseController');
const ValidationUtils = require('../utils/validationUtils');

class PostsController extends BaseController {
	constructor(postsManager) {
		super({ postsManager });
	}

	_onBind() {
		super._onBind();
		this.create = this.create.bind(this);
		this.edit = this.edit.bind(this);
		this.remove = this.remove.bind(this);
		this.obtain = this.obtain.bind(this);
		this.like = this.like.bind(this);
		this.voteForVariant = this.voteForVariant.bind(this);
	}

	_onCreate() {
		super._onCreate();
		this.validationUtils = new ValidationUtils;
	}

	create(req, res, next) {
		const invalid = this.validate(req)
			.add('accessToken').should.exist().and.have.type('String')
			.add('title').should.exist().and.have.type('String').and.be.in.rangeOf(3, 63)
			.add('text').should.exist().and.have.type('String').and.be.in.rangeOf(3, 500)
			.validate();

		if (invalid) return next(invalid.name);

		const variants = req.body.variants;
		if (!variants && variants.length === 0 && this.validationUtils.checkArray(variants, 1, 12)) return next('UNKNOWN');
		//TODO допилить валидацию
		const body = req.body;
		const company = req.userId;

		this
			.postsManager
			.create(company, body)
			.then(post => this.success(res, post))
			.catch(next);
	}

	edit(req, res, next) {
		const invalid = this.validate(req)
			.add('accessToken').should.exist().and.have.type('String')
			//.add('title').should.have.type('String').and.be.in.rangeOf(3, 63)
			//.add('text').should.have.type('String').and.be.in.rangeOf(3, 500)
			.validate();

		if (invalid) return next(invalid.name);

		const body = req.body;

		this
			.postsManager
			.edit(body.customId, body)
			.then(post => this.success(res, post))
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
			.postsManager
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

		const query = req.query;

		this
			.postsManager
			.obtain(query.limit, query.offset)
			.then(posts => this.success(res, posts))
			.catch(next);
	}

	like(req, res, next) {
		const invalid = this.validate(req)
			.add('accessToken').should.exist().and.have.type('String')
			.add('postId').should.exist().and.have.type('String')
			.validate();

		if (invalid) return next(invalid.name);

		const params = req.params;

		this
			.postsManager
			.like(req.userId, params.postId)
			.then(post => this.success(res, post))
			.catch(next);
	}

	voteForVariant(req, res, next) {
		const invalid = this.validate(req)
			.add('accessToken').should.exist().and.have.type('String')
			.add('postId').should.exist().and.have.type('String')
			.add('variantIndex').should.exist().and.have.type('String')
			.validate();

		if (invalid) return next(invalid.name);

		const userId = req.userId;
		const postId = req.params.postId;
		const variantIndex = req.params.variantIndex;
		this
			.postsManager
			.voteForVariant(userId, postId, variantIndex)
			.then(post => this.success(res, post))
			.catch(next);
	}
	//TODO перенести все респонсы в контроллеро
}

module.exports = PostsController;
