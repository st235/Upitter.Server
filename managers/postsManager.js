'use strict';

const _ = require('underscore');
const AppUnit = require('../app/unit');


class PostsManager extends AppUnit {
	constructor(postModel, companyModel) {
		super({ postModel, companyModel });
	}

	_onBind() {
		this.create = this.create.bind(this);
		this.edit = this.edit.bind(this);
		this.remove = this.remove.bind(this);
		this.obtain = this.obtain.bind(this);
		this.like = this.like.bind(this);
		this.voteForVariant = this.voteForVariant.bind(this);
	}

	create(companyId, title, text, category, latitude, longitude) {
		const data = {
			author: companyId,
			location: [latitude, longitude],
			title,
			text,
			category
		};

		const post = new this.postModel(data);
		return post
			.save()
			.catch(() => { throw 'INTERNAL_SERVER_ERROR' });
	}

	edit(companyId, postId, data) {
		return this
			.postModel
			.findOne({ customId: postId })
			.then(post => {
				if (!post || post.isRemoved) throw 'INTERNAL_SERVER_ERROR';
				if (companyId !== post.author) throw 'ACCESS_DENIED';

				const validatedData = _.omit(data, 'customId', 'author', 'comments', 'createdDate', 'rating', 'variants', 'voters');
				validatedData.updatedDate = Date.now();
				_.extend(post, validatedData);

				return post
					.save()
					.catch(() => { throw 'INTERNAL_SERVER_ERROR' });
			});
	}

	remove(companyId, postId) {
		return this
			.postModel
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

	obtain(latitude, longitude, radius, limit = 20, offset) {
		let resultPost;

		return this
			.postModel
			.getPosts(latitude, longitude, radius, parseInt(limit), parseInt(offset))
			.then(posts => {
				if (!posts) throw 'INTERNAL_SERVER_ERROR';
				resultPost = posts;
				return posts;
			})
			.then(posts => _.map(posts, post => this.companyModel.findById(post.author)))
			.then(promises => Promise.all(promises))
			.then(companies => _.each(companies, (company, i) => resultPost[i].author = company))
			.then(() => resultPost);
	}

	like(userId, postId) {
		return this
			.postModel
			.findOne({ customId: postId })
			.then(post => {
				if (!post) throw 'INTERNAL_SERVER_ERROR';
				const find = !!_.find(post.voters, vote => vote === userId);

				if (find) {
					post.voters = _.without(post.voters, userId);
					post.rating--;
				} else {
					post.voters.push(userId);
					post.rating++;
				}
				return post.save();
			})
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	voteForVariant(userId, postId, variantIndex) {
		return this
			.postModel
			.findOne({ customId: postId })
			.then(post => {
				if (!post) throw 'INTERNAL_SERVER_ERROR';
				if (_.indexOf(post.voters, userId) !== -1) throw 'USER_ALREADY_VOTED';
				post.votersForVariants.push(userId);
				post.variants[variantIndex].count++;
				return post
					.save()
					.catch(() => { throw 'INTERNAL_SERVER_ERROR' });
			});
	}
}

module.exports = PostsManager;
