'use strict';

const BaseController = require('./baseController');

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

	create(req, res) {
		const body = req.body;

		this
			.commentsManager
			.create(req.userId, body)
			.then(comment => this.success(res, comment))
			.catch(Error => this.error(res, Error));
	}

	remove(req, res) {
		const postId = req.query.customId;

		this
			.commentsManager
			.remove(postId)
			.then(removedId => this.success(res, removedId))
			.catch(Error => this.error(res, Error));
	}

	obtain(req, res) {
		const query = req.query;

		this
			.commentsManager
			.obtain(query.limit, query.offset)
			.then(comments => this.success(res, comments))
			.catch(Error => this.error(res, Error));
	}
}

module.exports = CommentsController;
