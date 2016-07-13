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

	create(companyId, title, text, category, latitude, longitude, variants) {
		const data = {
			author: companyId,
			location: [latitude, longitude],
			variants: _.map(variants, variant => {
				return {
					value: variant
				};
			}),
			title,
			text,
			category
		};

		let postResult;

		const post = new this.postModel(data);
		return post
			.save()
			.then(post => {
				postResult = post;
				return this.companyModel.findById(post.author);
			})
			.then(author => {
				postResult.author = author;
				return postResult;
			})
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
		let resultPost;

		return this
			.postModel
			.findOne({ customId: postId })
			.then(post => {
				if (!post) throw 'INTERNAL_SERVER_ERROR';
				const find = !!_.find(post.likeVoters, voterId => voterId === userId);

				if (find) {
					post.likeVoters = _.without(post.likeVoters, userId);
					post.likes--;
				} else {
					post.likeVoters.push(userId);
					post.likes++;
				}

				return post.save();
			})
			.then(post => {
				resultPost = post;
				return this.companyModel.findById(post.author);
			})
			.then(user => {
				resultPost.author = user;
				return resultPost;
			})
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	voteForVariant(userId, postId, variantIndex) {
		let resultPost;

		return this
			.postModel
			.findOne({ customId: postId })
			.then(post => {
				if (!post) throw 'INTERNAL_SERVER_ERROR';
				if (_.indexOf(post.voters, userId) !== -1) throw 'USER_ALREADY_VOTED';
				post.variants[variantIndex].voters.push(userId);
				post.variants[variantIndex].count++;
				return post.save();
			})
			.then(post => {
				resultPost = post;
				return this.companyModel.findById(post.author);
			})
			.then(author => {
				resultPost.author = author;
				return resultPost;
			})
			.catch(() => { throw 'INTERNAL_SERVER_ERROR' });
	}
}

module.exports = PostsManager;
