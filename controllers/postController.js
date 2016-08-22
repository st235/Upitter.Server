'use strict';
const _ = require('underscore');

const BaseController = require('./baseController');
const ValidationUtils = require('../utils/validationUtils');
const fileServerUtils = require('../utils/fileServerUtils');

const postResponse = require('../models/response/postResponseModel');
const companyResponse = require('../models/response/companyResponseModel');

class PostsController extends BaseController {
	constructor(postsManager, usersManager, companiesManager) {
		super({
			postsManager,
			usersManager,
			companiesManager
		});
	}

	_onBind() {
		super._onBind();
		this.create = this.create.bind(this);
		this._savePost = this._savePost.bind(this);
		this.edit = this.edit.bind(this);
		this.favorite = this.favorite.bind(this);
		this.remove = this.remove.bind(this);
		this.findById = this.findById.bind(this);

		this.obtain = this.obtain.bind(this);
		this.obtainNew = this.obtainNew.bind(this);
		this.obtainOld = this.obtainOld.bind(this);

		this.obtainByCompany = this.obtainByCompany.bind(this);

		this.obtainFavorites = this.obtainFavorites.bind(this);
		this.obtainOldFavorites = this.obtainOldFavorites.bind(this);

		this.like = this.like.bind(this);
		this.voteForVariant = this.voteForVariant.bind(this);
		this.watch = this.watch.bind(this);
	}

	_onCreate() {
		super._onCreate();
		this.validationUtils = new ValidationUtils;
	}

	_savePost(companyId, title, text, category, latitude, longitude, variants, images, userId, ln, res, next) {
		return this
			.postsManager
			.create(companyId, title, text, category, latitude, longitude, variants, images)
			.then(post => postResponse(userId, post, ln))
			.then(response => this.success(res, response))
			.catch(next);
	}

	create(req, res, next) {
		const invalid = this.validate(req)
			.add('accessToken').should.exist().and.have.type('String')
			.add('title').should.exist().and.have.type('String').and.be.in.rangeOf(3, 63)
			.add('text').should.exist().and.have.type('String').and.be.in.rangeOf(3, 1000)
			.add('category').should.exist().and.have.type('String')
			.add('latitude').should.exist().and.have.type('Number')
			.add('longitude').should.exist().and.have.type('Number')
			.validate();

		if (invalid) return next(invalid.name);

		const companyId = req.userId;
		const { variants } = req.body;

		if (variants &&
			variants.length < 0 &&
			!this.validationUtils.checkArray(variants, 1, 12)) return next('PROPERTY_NOT_SUPPLIED');

		const { title, text, category, latitude, longitude, images } = req.body;

		if (images && images.length) {
			return fileServerUtils.getInfoByFidsArray(companyId, images).then(images => {
				return this._savePost(companyId, title, text, category, latitude, longitude, variants, images, req.userId, req.ln, res, next);
			});
		} else {
			return this._savePost(companyId, title, text, category, latitude, longitude, variants, images, req.userId, req.ln, res, next);
		}
	}

	findById(req, res, next) {
		const invalid = this.validate(req)
			.add('postId').should.exist().and.have.type('String')
			.validate();

		if (invalid) return next(invalid.name);

		const postId = req.params.postId;

		this
			.postsManager
			.findById(postId)
			.then(({ post, author }) => {
				const company = companyResponse(author);
				return postResponse(req.userId, post, req.ln, company);
			})
			.then(response => this.success(res, response))
			.catch(next);
	}

	edit(req, res, next) {
		//  TODO: add coordinates
		const invalid = this.validate(req)
			.add('accessToken').should.exist().and.have.type('String')
			//.add('title').should.have.type('String').and.be.in.rangeOf(3, 63)
			//.add('text').should.have.type('String').and.be.in.rangeOf(3, 1000)
			.validate();

		if (invalid) return next(invalid.name);

		const body = req.body;
		const companyId = req.userId;

		this
			.postsManager
			.edit(companyId, body.postId, body)
			.then(post => postResponse(req.userId, post, req.ln))
			.then(response => this.success(res, response))
			.catch(next);
	}

	favorite(req, res, next) {
		const invalid = this.validate(req)
			.add('postId').should.exist().and.have.type('String')
			.validate();

		if (invalid) return next(invalid.name);

		const { userId } = req;
		const { postId } = req.params;
		const customId = parseInt(userId, 10);

		this
			.postsManager
			.getObjectId(postId)
			.then(postObjId => customId > 0 ? this.usersManager.favorite(customId, postObjId) : this.companiesManager.favorite(customId, postObjId))
			.then(() => this.postsManager.favorite(userId, postId))
			.then(post => postResponse(userId, post, req.ln))
			.then(response => this.success(res, response))
			.catch(next);
	}

	obtainFavorites(req, res, next) {
		const { userId, ln } = req;
		const { limit = 20 } = req.query;
		const customId = parseInt(userId, 10);
		let resultPosts;

		new Promise((resolve, reject) => resolve(
				customId > 0
				? this.usersManager.getFavorites(customId)
				: this.companiesManager.getFavorites(customId))
			)
			.then(favorites => {
				if (!favorites) throw 'INTERNAL_SERVER_ERROR';
				resultPosts = favorites;
				return favorites;
			})
			.then(favorites => _.map(favorites, post => this.companiesManager.findById(post.author)))
			.then(promises => Promise.all(promises))
			.then(companies => _.each(companies, (company, i) => resultPosts[i] = postResponse(userId, resultPosts[i], ln, company)))
			.then(() => resultPosts.splice(0, limit))
			.then(posts => this.success(res, { posts }))
			.catch(next);
	}

	obtainOldFavorites(req, res, next) {
		const { userId, ln } = req;
		const { postId, limit = 20 } = req.query;
		const customId = parseInt(userId, 10);
		let resultPosts;
		let index;

		new Promise((resolve, reject) => resolve(
			customId > 0
				? this.usersManager.getFavorites(customId, limit)
				: this.companiesManager.getFavorites(customId, limit))
			)
			.then(favorites => {
				if (!favorites) throw 'INTERNAL_SERVER_ERROR';
				resultPosts = favorites;
				return favorites;
			})
			.then(favorites => _.map(favorites, post => this.companiesManager.findById(post.author)))
			.then(promises => Promise.all(promises))
			.then(companies => _.each(companies, (company, i) => resultPosts[i] = postResponse(userId, resultPosts[i], ln, company)))
			.then(() => _.each(resultPosts, (post, i) => (post.customId === parseInt(postId, 10)) ? index = i : index))
			.then(promises => Promise.all(promises))
			.then(() => resultPosts.splice(index + 1, limit))
			.then(posts => this.success(res, { posts }))
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
			.add('latitude').should.exist().and.have.type('String')
			.add('longitude').should.exist().and.have.type('String')
			.validate();

		if (invalid) return next(invalid.name);

		if (req.query.limit) {
			try {
				req.query.limit = parseInt(req.query.limit, 10);
			} catch (e) {
				req.query.limit = 20;
			}
		}

		const { latitude, longitude, radius = 0, limit = 20, category, activity } = req.query;
		// category = скидки/распродажа/все дерьмо (с), activity = компания
		this
			.postsManager
			.obtain(latitude, longitude, radius, limit, category, activity)
			.then(posts => _.map(posts, post => postResponse(req.userId, post, req.ln)))
			.then(response => this.success(res, { posts: response }))
			.catch(next);
	}

	obtainNew(req, res, next) {
		const invalid = this.validate(req)
			.add('latitude').should.exist().and.have.type('Number')
			.add('longitude').should.exist().and.have.type('Number')
			.add('postId').should.exist().and.have.type('Number')
			.validate();

		if (invalid) return next(invalid.name);

		const { postId, latitude, longitude, radius = 0, category, activity } = req.query;

		this
			.postsManager
			.obtainNew(postId, latitude, longitude, radius, category, activity)
			.then(posts => _.map(posts, post => postResponse(req.userId, post, req.ln)))
			.then(response => this.success(res, { posts: response }))
			.catch(next);
	}

	obtainOld(req, res, next) {
		const invalid = this.validate(req)
			.add('latitude').should.exist().and.have.type('Number')
			.add('longitude').should.exist().and.have.type('Number')
			.add('postId').should.exist().and.have.type('Number')
			// .add('category').should.have.type('String')
			// .add('limit').should.have.type('String')
			.validate();

		if (invalid) return next(invalid.name);

		const { postId, latitude, longitude, radius = 0, category, limit = 20, activity } = req.query;

		this
			.postsManager
			.obtainOld(postId, latitude, longitude, radius, category, limit, activity)
			.then(posts => _.map(posts, post => postResponse(req.userId, post, req.ln)))
			.then(response => this.success(res, { posts: response }))
			.catch(next);
	}

	obtainByCompany(req, res, next) {
		const invalid = this.validate(req)
			.add('companyId').should.exist().and.have.type('String')
			.validate();

		if (invalid) return next(invalid.name);

		const { companyId, limit = 20, postId, type } = req.query;
		let count;

		this
			.postsManager
			.obtainByCompany(companyId, limit, postId, type)
			.then(result => {
				count = result.count;
				return _.map(result.posts, post => postResponse(req.userId, post, req.ln));
			})
			.then(response => this.success(res, { count, posts: response }))
			.catch(next);
	}

	like(req, res, next) {
		const invalid = this.validate(req)
			.add('accessToken').should.exist().and.have.type('String')
			.add('postId').should.exist().and.have.type('String')
			.validate();

		if (invalid) return next(invalid.name);

		const { userId } = req;
		const { postId } = req.params;

		this
			.postsManager
			.like(userId, postId)
			.then(post => postResponse(req.userId, post, req.ln))
			.then(response => this.success(res, response))
			.catch(next);
	}

	watch(req, res, next) {
		const invalid = this.validate(req)
			.add('postId').should.exist().and.have.type('String')
			.validate();

		if (invalid) return next(invalid.name);

		const { userId } = req;
		const { postId } = req.params;

		this
			.postsManager
			.watch(userId, postId)
			.then(post => postResponse(userId, post, req.ln))
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

		const { userId } = req;
		const { postId } = req.params;
		const variantIndex = req.params.variantIndex;

		this
			.postsManager
			.voteForVariant(userId, postId, variantIndex)
			.then(post => postResponse(req.userId, post, req.ln))
			.then(response => this.success(res, response))
			.catch(next);
	}
}

module.exports = PostsController;
