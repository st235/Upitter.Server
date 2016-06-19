'use strict';

const _ = require('underscore');
const postResponse = require('../models/response/postResponse');

class PostsManager {
	constructor(postsModel) {
		this.postsModel = postsModel;

		this.create = this.create.bind(this);
		this.edit = this.edit.bind(this);
		this.remove = this.remove.bind(this);
		this.obtain = this.obtain.bind(this);
	}

	create(data) {
		data.createdDate = Date.now();
		const post = new this.postsModel(data);
		return post.save().then(post => {
			if (!post) throw new Error(500);
			return postResponse(post);
		});
	}

	edit(postId, data) {
		return this
			.postsModel
			.findOne({ customId: postId })
			.then(postModel => {
				if (!postModel) throw new Error(500);
				data.updatedDate = Date.now();
				_.extend(postModel, data);
				return postModel.save();
			})
			.then(post => {
				if (!post) throw new Error(500);
				return postResponse(post);
			});
	}

	remove(postId) {
		return this
			.postsModel
			.findOneAndUpdate({ customId: postId }, { isRemoved: true }, { new: true })
			.then(post => post.save())
			.then(post => post.customId);
	}

	obtain(limit = 20, offset) {
		return this
			.postsModel
			.getPosts(parseInt(limit), parseInt(offset))
			.then(posts => {
				if (!posts) throw new Error(500);
				return _.map(posts, (post) => postResponse(post));
			});
	}
}

module.exports = PostsManager;