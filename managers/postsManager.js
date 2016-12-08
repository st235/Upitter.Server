'use strict';

const _ = require('underscore');
const AppUnit = require('../app/unit');


class PostsManager extends AppUnit {
	constructor(postModel, companyModel, commentModel) {
		super({
			postModel,
			companyModel,
			commentModel
		});
	}

	_onBind() {
		this.create = this.create.bind(this);
		this.edit = this.edit.bind(this);
		this.findById = this.findById.bind(this);
		this.remove = this.remove.bind(this);
		this.obtain = this.obtain.bind(this);
		this.obtainNew = this.obtainNew.bind(this);
		this.obtainOld = this.obtainOld.bind(this);
		this.obtainByCompany = this.obtainByCompany.bind(this);
		this.like = this.like.bind(this);
		this.watch = this.watch.bind(this);
		this.voteForVariant = this.voteForVariant.bind(this);
		this.getObjectId = this.getObjectId.bind(this);
		this.favorite = this.favorite.bind(this);
		this.obtainAllPostsByCompany = this.obtainAllPostsByCompany.bind(this);
	}

	create(companyId, title, text, category, latitude, longitude, variants, images) {
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

		if (images) data.images = images;

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
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	edit(companyId, postId, data) {
		return this
			.postModel
			.findOne({ customId: postId, isRemoved: false })
			.then(post => {
				if (!post || post.isRemoved) throw 'INTERNAL_SERVER_ERROR';
				if (companyId !== post.author) throw 'ACCESS_DENIED';

				const validatedData = _.omit(data, 'customId', 'author', 'comments', 'createdDate', 'rating', 'variants', 'voters');
				validatedData.updatedDate = Date.now();
				_.extend(post, validatedData);

				return post
					.save()
					.catch(() => {
						throw 'INTERNAL_SERVER_ERROR';
					});
			});
	}

	findById(postId) {
		let currentPost;

		return this
			.postModel
			.findOne({ customId: postId })
			.populate('postComments')
			.then(post => {
				if (!post) throw 'INTERNAL_SERVER_ERROR';
				if (post.isRemoved) throw 'POST_DELETED';
				currentPost = post;
				const authorId = parseInt(post.author, 10);
				return this.companyModel.findOne({ customId: authorId });
			})
			.then(author => {
				return { post: currentPost, author };
			});
	}

	remove(companyId, postId) {
		return this
			.postModel
			.findOneAndUpdate({ customId: postId }, { isRemoved: true }, { new: true })
			.then(post => {
				if (!post || !post.isRemoved) throw 'INTERNAL_SERVER_ERROR';
				if (companyId !== post.author) throw 'ACCESS_DENIED';

				return post
					.save()
					.catch(() => { throw 'INTERNAL_SERVER_ERROR' });
			})
			.then(post => post.customId);
	}

	obtain(latitude, longitude, radius, limit, category, activity) {
		let resultPosts;

		return this
			.postModel
			.getPosts(latitude, longitude, radius, limit, category)
			.then(posts => {
				if (!posts) throw 'INTERNAL_SERVER_ERROR';
				resultPosts = posts;
				return posts;
			})
			.then(posts => _.map(posts, post => this.companyModel.findById(post.author)))
			.then(promises => Promise.all(promises))
			.then(companies => _.each(companies, (company, i) => resultPosts[i].author = company))
			.then(() => _.map(resultPosts, post => this.commentModel.countComments(post.customId)))
			.then(promises => Promise.all(promises))
			.then(amounts => _.each(amounts, (amount, i) => resultPosts[i].commentsAmount = amount))
			.then(() => {
				if (!activity || !activity.length) return resultPosts;
				return _.filter(resultPosts, singlePost => {
					return _.intersection(activity, singlePost.author.activity).length;
				});
			})
			.then(posts => posts.splice(0, limit));
	}

	obtainNew(postId, latitude, longitude, radius, category, activity) {
		let resultPosts;

		return this
			.postModel
			.getNew(postId, latitude, longitude, radius, category)
			.then(posts => {
				if (!posts) throw 'INTERNAL_SERVER_ERROR';
				resultPosts = posts;
				return posts;
			})
			.then(posts => _.map(posts, post => this.companyModel.findById(post.author)))
			.then(promises => Promise.all(promises))
			.then(companies => _.each(companies, (company, i) => resultPosts[i].author = company))
			.then(() => _.map(resultPosts, post => this.commentModel.countComments(post.customId)))
			.then(promises => Promise.all(promises))
			.then(amounts => _.each(amounts, (amount, i) => resultPosts[i].commentsAmount = amount))
			.then(() => {
				if (!activity || !activity.length) return resultPosts;
				return _.filter(resultPosts, singlePost => {
					return _.intersection(activity, singlePost.author.activity).length;
				});
			});
	}

	obtainOld(postId, latitude, longitude, radius, category, limit, activity) {
		let resultPosts;

		return this
			.postModel
			.getOld(postId, latitude, longitude, radius, category, limit)
			.then(posts => {
				if (!posts) throw 'INTERNAL_SERVER_ERROR';
				resultPosts = posts;
				return posts;
			})
			.then(posts => _.map(posts, post => this.companyModel.findById(post.author)))
			.then(promises => Promise.all(promises))
			.then(companies => _.each(companies, (company, i) => resultPosts[i].author = company))
			.then(() => _.map(resultPosts, post => this.commentModel.countComments(post.customId)))
			.then(promises => Promise.all(promises))
			.then(amounts => _.each(amounts, (amount, i) => resultPosts[i].commentsAmount = amount))
			.then(() => {
				if (!activity || !activity.length) return resultPosts;
				return _.filter(resultPosts, singlePost => {
					return _.intersection(activity, singlePost.author.activity).length;
				});
			});
	}

	obtainByCompany(companyId, limit, postId, type) {
		let resultPosts;
		let resultCount;
		let resultAuthor;

		return this
			.postModel
			.getPostsByCompany(companyId, limit, postId, type)
			.then(posts => {
				if (!posts) throw 'INTERNAL_SERVER_ERROR';
				resultPosts = posts;
				return this.companyModel.findById(parseInt(companyId, 10));
			})
			.then(author => resultAuthor = author)
			.then(() => this.postModel.find({ author: companyId, isRemoved: false }).count().exec())
			.then(count => {
				resultCount = count;
				return _.map(resultPosts, post => this.commentModel.countComments(post.customId));
			})
			.then(promises => Promise.all(promises))
			.then(commentsAmount => {
				return {
					posts: resultPosts,
					count: resultCount,
					author: resultAuthor,
					commentsAmount
				};
			});
	}

	like(userId, postId) {
		let resultPost;
		let isLiked;

		return this
			.postModel
			.findOne({ customId: postId, isRemoved: false })
			.then(post => {
				if (!post) throw 'INTERNAL_SERVER_ERROR';
				const find = !!_.find(post.likeVoters, voterId => voterId === userId);

				if (find) {
					post.likeVoters = _.without(post.likeVoters, userId);
					post.likes--;
					isLiked = false;
				} else {
					post.likeVoters.push(userId);
					post.likes++;
					isLiked = true;
				}

				return post.save();
			})
			.then(post => {
				resultPost = post;
				return this.companyModel.findById(post.author);
			})
			.then(company => {
				if (!company) throw 'INTERNAL_SERVER_ERROR';
				isLiked ? company.rating++ : company.rating--;
				return company.save();
			})
			.then(company => {
				resultPost.author = company;
				return {
					post: resultPost,
					isLiked
				};
			})
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	watch(userId, postId) {
		let resultPost;

		return this
			.postModel
			.findOne({ customId: postId, isRemoved: false })
			.then(post => {
				if (!post) throw 'INTERNAL_SERVER_ERROR';
				const found = !!_.find(post.watchers, watcherId => watcherId === userId);

				if (!found) {
					post.watchers.push(userId);
					post.watches++;
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
			.findOne({ customId: postId, isRemoved: false })
			.then(post => {
				if (!post) throw 'INTERNAL_SERVER_ERROR';
				if (_.find(post.votersForVariants, voterId => voterId === userId)) throw 'USER_ALREADY_VOTED';
				post.votersForVariants.push(userId);
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
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	getObjectId(postId) {
		return this
			.postModel
			.findOne({ customId: parseInt(postId, 10) })
			.exec()
			.then(post => post._id)
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	favorite(userId, postId) {
		let resultPost;

		return this
			.postModel
			.findOne({ customId: postId, isRemoved: false })
			.then(post => {
				if (!post) throw 'INTERNAL_SERVER_ERROR';
				const found = !!_.find(post.favoriteVoters, watcherId => watcherId === userId);

				if (found) {
					post.favoriteVoters = _.without(post.favoriteVoters, userId);
					post.favorites--;
				} else {
					post.favoriteVoters.push(userId);
					post.favorites++;
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

	obtainAllPostsByCompany(companyId) {
		return this
			.postModel
			.find({ author: companyId, isRemoved: false  })
			.exec()
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}
}

module.exports = PostsManager;
