'use strict';

const _ = require('underscore');
const AppUnit = require('../app/unit');

const postResponse = require('../models/response/postResponse');

class PostsManager extends AppUnit {
	constructor(postsModel) {
		super({ postsModel });
	}

	_onBind() {
		this.create = this.create.bind(this);
		this.edit = this.edit.bind(this);
		this.remove = this.remove.bind(this);
		this.obtain = this.obtain.bind(this);
		this.like = this.like.bind(this);
		this.voteForVariant = this.voteForVariant.bind(this);
	}

	create(companyId, data) {
		data.author = companyId;
		const post = new this.postsModel(data);
		return post.save()
			.then(post => postResponse(post))
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	edit(postId, data) {
		return this
			.postsModel
			.findOne({ customId: postId })
			.then(postModel => {
				data.updatedDate = Date.now();
				_.extend(postModel, data);
				return postModel.save();
			})
			.then(post => postResponse(post))
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	remove(postId) {
		return this
			.postsModel
			.findOneAndUpdate({ customId: postId }, { isRemoved: true }, { new: true })
			.then(post => post.save())
			.then(post => post.customId)
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	obtain(limit = 20, offset) {
		return this
			.postsModel
			.getPosts(parseInt(limit), parseInt(offset))
			.then(posts => {
				if (!posts) throw new Error(500);
				return _.map(posts, (post) => postResponse(post));
			})
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	like(userId, postId) {
		return this
			.postsModel
			.findOne({ customId: postId })
			.then(post => {
				if (!post) throw new Error(500);
				if (_.indexOf(post._voters, userId) > -1) {
					post._voters = _.without(post._voters, userId);
					post.rating--;
				} else {
					post._voters.push(userId);
					post.rating++;
				}
				return post.save();
			})
			.then(post => postResponse(post))
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	voteForVariant(userId, postId, variantIndex) {
		return this
			.postsModel
			.findOne({ customId: postId })
			.then(post => {
				if (_.indexOf(post._voters, userId) !== -1) throw ''; //todo !!!
				post._voters.push(userId);
				post.variants[variantIndex].count++;
				return post.save();
			})
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}
}

module.exports = PostsManager;
