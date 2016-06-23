'use strict';

const BaseController = require('./baseController');

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
	}

	create(req, res) {
		const body = req.body;
		const company = req.userId;

		this
			.postsManager
			.create(company, body)
			.then(post => this.success(res, post))
			.catch(Error => this.error(res, Error));
	}

	edit(req, res) {
		const body = req.body;

		this
			.postsManager
			.edit(body.customId, body)
			.then(post => this.success(res, post))
			.catch(Error => this.error(res, Error));
	}

	remove(req, res) {
		const postId = req.query.customId;

		this
			.postsManager
			.remove(postId)
			.then(removedId => this.success(res, removedId))
			.catch(Error => this.error(res, Error));
	}

	obtain(req, res) {
		const query = req.query;

		this
			.postsManager
			.obtain(query.limit, query.offset)
			.then(posts => this.success(res, posts))
			.catch(Error => this.error(res, Error));
	}

	like(req, res) {
		const params = req.params;

		this
			.postsManager
			.like(req.userId, params.postId)
			.then(post => this.success(res, post))
			.catch(error => this.error(res, error));
	}
}

module.exports = PostsController;
