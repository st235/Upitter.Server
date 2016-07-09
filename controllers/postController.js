'use strict';
const _ = require('underscore');

const BaseController = require('./baseController');
const ValidationUtils = require('../utils/validationUtils');
const postResponse = require('../models/response/postResponseModel');

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
		if (variants && variants.length !== 0 && !this.validationUtils.checkArray(variants, 1, 12)) return next('PROPERTY_NOT_SUPPLIED');

		const { title, text, latitude, longitude } = req.body;
		const companyId = req.userId;

		this
			.postsManager
			.create(companyId, title, text, latitude, longitude)
			.then(post => postResponse(post))
			.then(response => this.success(res, response))
			.catch(next);
	}

	edit(req, res, next) {
		//  TODO: add coordinates
		const invalid = this.validate(req)
			.add('accessToken').should.exist().and.have.type('String')
			//.add('title').should.have.type('String').and.be.in.rangeOf(3, 63)
			//.add('text').should.have.type('String').and.be.in.rangeOf(3, 500)
			.validate();

		if (invalid) return next(invalid.name);

		const body = req.body;
		const companyId = req.userId;

		this
			.postsManager
			.edit(companyId, body.postId, body)
			.then(post => postResponse(post))
			.then(response => this.success(res, response))
			.catch(next);
	}

	remove(req, res, next) {
		const invalid = this.validate(req)
			.add('accessToken').should.exist().and.have.type('String')
			.add('postId').should.exist().and.have.type('String')
			.validate();

		if (invalid) return next(invalid.name);

		const postId = req.query.postId;
		const companyId = req.userId;

		this
			.postsManager
			.remove(companyId, postId)
			.then(removedId => this.success(res, removedId))
			.catch(next);
	}

	obtain(req, res, next) {
		const invalid = this.validate(req)
			.add('limit').should.exist().and.have.type('String')
			.validate();

		if (invalid) return next(invalid.name);

		const { latitude, longitude, radius = 0, limit, offset = 0 } = req.query;

		this
			.postsManager
			.obtain(latitude, longitude, radius, limit, offset)
			.then(posts => _.map(posts, post => postResponse(post)))
			.then(response => this.success(res, { offset: parseInt(offset, 10) + response.length, posts: response }))
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
			.then(post => postResponse(post))
			.then(response => this.success(res, response))
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
			.then(post => postResponse(post))
			.then(response => this.success(res, response))
			.catch(next);
	}
}

module.exports = PostsController;
