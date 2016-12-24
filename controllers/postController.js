'use strict';
const _ = require('underscore');

const BaseController = require('./baseController');
const ValidationUtils = require('../utils/validationUtils');
const fileServerUtils = require('../utils/fileServerUtils');

const postResponse = require('../models/response/postResponseModel');
const companyResponse = require('../models/response/companyResponseModel');

class PostsController extends BaseController {
	constructor(postsManager, usersManager, companiesManager, commentsManager, notificationManager) {
		super({
			postsManager,
			usersManager,
			companiesManager,
			commentsManager,
			notificationManager
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
		this.obtainByAlias = this.obtainByAlias.bind(this);

		this.obtainFavorites = this.obtainFavorites.bind(this);
		this.obtainOldFavorites = this.obtainOldFavorites.bind(this);

		this.like = this.like.bind(this);
		this.voteForVariant = this.voteForVariant.bind(this);
		this.watch = this.watch.bind(this);

		this.obtainPostsBySubscriptions = this.obtainPostsBySubscriptions.bind(this);
	}

	_onCreate() {
		super._onCreate();
		this.validationUtils = new ValidationUtils;
	}

	_savePost(companyId, title, text, category, latitude, longitude, variants, images, userId, ln, res, next) {
		let currentPost;
		return this
			.postsManager
			.create(companyId, title, text, category, latitude, longitude, variants, images)
			.then(post => {
				currentPost = post;
				return this.createNotification(post, companyId);
			})
			.then(() => postResponse(userId, currentPost, ln))
			.then(response => this.success(res, response))
			.catch(next);
	}

	createNotification(post, companyId) {
		let currentObjId;

		return this
			.companiesManager
			.getObjectId(companyId)
			.then(objId => {
				currentObjId = objId;
				return this.companiesManager.getSebscrubersIds(companyId);
			})
			.then(subscribersIds => this.notificationManager.create('post', currentObjId, post.customId, subscribersIds, 'company'));
	}

	create(req, res, next) {
		const invalid = this.validate(req)
			.add('accessToken').should.exist().and.have.type('String')
			.add('title').should.exist().and.have.type('String').and.be.in.rangeOf(3, 63)
			.add('text').should.exist().and.have.type('String').and.be.in.rangeOf(3, 1400)
			.add('category').should.exist().and.have.type('String')
			.add('latitude').should.exist().and.have.type('Number')
			.add('longitude').should.exist().and.have.type('Number')
			.validate();

		if (invalid) return next(invalid.name);

		const companyId = req.userId;
		const { title, text, category, latitude, longitude, images, variants } = req.body;

		if (variants &&
			variants.length < 0 &&
			!this.validationUtils.checkArray(variants, 1, 12)) return next('PROPERTY_NOT_SUPPLIED');

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
		let commentsAmount;

		this
			.commentsManager
			.count(postId)
			.then(commentsCount => commentsAmount = commentsCount)
			.then(() => this.postsManager.findById(postId))
			.then(({ post, author }) => postResponse(req.userId, post, req.ln, companyResponse(author), commentsAmount))
			.then(result => this.success(res, result))
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
		let resultCompanies;

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
			.then(companies => {
				resultCompanies = companies;
				return _.map(resultPosts, post => this.commentsManager.count(post.customId));
			})
			.then(promises => Promise.all(promises))
			.then(commentsAmount => _.each(resultPosts, (post, i) => {
				return resultPosts[i] = postResponse(
					userId,
					post,
					ln,
					resultCompanies[i],
					commentsAmount[i]
				);
			}))
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
			.then(posts => _.map(posts, post => this
					.commentsManager
					.count(post.customId)
					.then(commentsAmount => postResponse(req.userId, post, req.ln, null, commentsAmount))
			))
			.then(promises => Promise.all(promises))
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
			.then(posts => _.map(posts, post => this
				.commentsManager
				.count(post.customId)
				.then(commentsAmount => postResponse(req.userId, post, req.ln, null, commentsAmount))
			))
			.then(promises => Promise.all(promises))
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
			.then(posts => _.map(posts, post => this
				.commentsManager
				.count(post.customId)
				.then(commentsAmount => postResponse(req.userId, post, req.ln, null, commentsAmount))
			))
			.then(promises => Promise.all(promises))
			.then(response => this.success(res, { posts: response }))
			.catch(next);
	}

	obtainByCompany(req, res, next) {
		const invalid = this.validate(req)
			.add('companyId').should.exist().and.have.type('String')
			.validate();

		if (invalid) return next(invalid.name);

		const { type } = req.params;
		const { companyId, limit = 20, postId } = req.query;
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

	obtainByAlias(req, res, next) {
		const invalid = this.validate(req)
			.add('alias').should.exist().and.have.type('String')
			.validate();

		if (invalid) return next(invalid.name);

		const { type } = req.params;
		const { alias, limit = 20, postId } = req.query;
		let count;

		this
			.companiesManager
			.findByAlias(alias)
			.then(company => this.postsManager.obtainByCompany(company.customId, limit, postId, type))
			.then(result => {
				count = result.count;
				return _.map(result.posts, (post, i) => postResponse(req.userId, post, req.ln, result.author, result.commentsAmount[i]));
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
		let currentResult;

		this
			.postsManager
			.like(userId, postId)
			.then(result => {
				currentResult = result;
				return (userId > 0) ? this.usersManager.getObjectId(userId) : this.companiesManager.getObjectId(userId);
			})
			.then(objectId => {
				if (currentResult.isLiked) {
					return (userId > 0) ? this.notificationManager.create('like', objectId, postId, [currentResult.post.author.customId], 'user')
										: this.notificationManager.create('like', objectId, postId, [currentResult.post.author.customId], 'company');
				}
			})
			.then(() => postResponse(req.userId, currentResult.post, req.ln))
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

	obtainPostsBySubscriptions(req, res, next) {
		const { userId, ln } = req;
		const { limit = 20, postId } = req.query;

		let currentPosts;
		let amount;
		let index = 0;

		this
			.usersManager
			.getSubscriptions(parseInt(userId, 10))
			.then(user => _.map(user.subscriptions, company => {
				return this
					.postsManager
					.obtainAllPostsByCompany(company.customId)
					.then(posts => _.map(posts, post => postResponse(userId, post, ln, company)));
			}))
			.then(promises => Promise.all(promises))
			.then(posts => _.flatten(_.compact(posts)))
			.then(posts => _.sortBy(posts, post => - post.createdDate))
			.then(promises => Promise.all(promises))
			.then(posts => {
				currentPosts = posts;
				amount = posts.length;
				return postId ? _.each(posts, (post, i) => (post.customId === parseInt(postId, 10)) ? index = i + 1 : index) : posts;
			})
			.then(promises => Promise.all(promises))
			.then(() => currentPosts.splice(index, limit))
			.then(posts => _.map(posts, post => {
				return this
					.commentsManager
					.count(post.customId)
					.then(commentsAmount => {
						post.commentsAmount = commentsAmount;
						return post;
					});
			}))
			.then(promises => Promise.all(promises))
			.then(posts => this.success(res, { amount, posts }))
			.catch(next);
	}
}

module.exports = PostsController;
