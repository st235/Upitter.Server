'use strict';

const _ = require('underscore');
const moment = require('moment');

const CompanyResponseModel = require('./companyResponseModel');

module.exports = (userId, post, lang = 'en') => {
	const inVoters = !!_.find(post.likeVoters, voterId => voterId === userId);

	const postResponse = {
		customId: post.customId,
		author: post.author, // TODO: Отдавать полноценного пользователя
		title: post.title,
		text: post.text,
		category: post.category,
		fromNow: moment(post.createdDate).locale(lang).fromNow(),
		likesAmount: post.likes,
		commentsAmount: post.comments.length,
		isLikedByMe: inVoters
	};

	if (post.comments.length > 0) postResponse.comments = post.comments;
	if (post.variants.length > 0) {
		postResponse.variants = _.map(post.variants, (variant) => {
			return {
				value: variant.value,
				count: variant.count
			};
		});
	}

	if (post.likeVoters.length > 0) postResponse.likeVoters = post.likeVoters;
	if (post.votersForVariants > 0) postResponse.votersForVariants = post.votersForVariants;
	if (post.logoUrl) postResponse.logoUrl = post.logoUrl;
	if (post.updatedDate) postResponse.updatedDate = post.updatedDate;

	return postResponse;
};
