'use strict';

const _ = require('underscore');
const AppUnit = require('../app/unit');


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
		return post
			.save()
			.catch(() => { throw 'INTERNAL_SERVER_ERROR' });
	}

	edit(companyId, postId, data) {
		return this
			.postsModel
			.findOne({ customId: postId })
			.then(post => {
				if (!post || post.isRemoved) throw 'INTERNAL_SERVER_ERROR';
				if (companyId !== post.author) throw 'ACCESS_DENIED';

				const validatedData = _.omit(data, 'customId', 'author', 'comments', 'createdDate', 'rating', 'variants', '_voters');
				validatedData.updatedDate = Date.now();
				_.extend(post, validatedData);

				return post
					.save()
					.catch(() => { throw 'INTERNAL_SERVER_ERROR' });
			});
	}

	remove(companyId, postId) {
		return this
			.postsModel
			.findOneAndUpdate({ customId: postId }, { isRemoved: true }, { new: true })
			.then(post => {
				if (!post || post.isRemoved) throw 'INTERNAL_SERVER_ERROR';
				if (companyId !== post.author) throw 'ACCESS_DENIED';

				return post
					.save()
					.catch(() => { throw 'INTERNAL_SERVER_ERROR' });
			})
			.then(post => post.customId);
	}

	obtain(limit = 20, offset) {
		return this
			.postsModel
			.getPosts(parseInt(limit), parseInt(offset))
			.then(posts => {
				if (!posts) throw 'INTERNAL_SERVER_ERROR';
				return posts;
			});
	}

	like(userId, postId) {
		return this
			.postsModel
			.findOne({ customId: postId })
			.then(post => {
				if (!post) throw 'INTERNAL_SERVER_ERROR';
				if (_.indexOf(post._voters, userId) > -1) {
					post._voters = _.without(post._voters, userId);
					post.rating--;
				} else {
					post._voters.push(userId);
					post.rating++;
				}
				return post
					.save()
					.catch(() => { throw 'INTERNAL_SERVER_ERROR' });
			});
	}

	voteForVariant(userId, postId, variantIndex) {
		return this
			.postsModel
			.findOne({ customId: postId })
			.then(post => {
				if (!post) throw 'INTERNAL_SERVER_ERROR';
				if (_.indexOf(post._voters, userId) !== -1) throw 'USER_ALREADY_VOTED';
				post._votersForVariants.push(userId);
				post.variants[variantIndex].count++;
				return post
					.save()
					.catch(() => { throw 'INTERNAL_SERVER_ERROR' });
			});
	}
}

module.exports = PostsManager;
