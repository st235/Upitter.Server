'use strict';

const BaseController = require('./baseController');

class PostsController extends BaseController {
	constructor(postsManager) {
		super();
		this.postsManager = postsManager;

		this.create = this.create.bind(this);
		this.edit = this.edit.bind(this);
		this.remove = this.remove.bind(this);
		this.obtain = this.obtain.bind(this);
	}

	create(req, res) {
		const body = req.body;

		this
			.postsManager
			.create(body)
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
}

module.exports = PostsController;
