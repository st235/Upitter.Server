'use strict';

const _ = require('underscore');
const moment = require('moment');

const CompanyResponseModel = require('./companyResponseModel');
const mathUtils = require('../../utils/mathUtils');

module.exports = (userId, post, lang = 'en') => {
	const voters = mathUtils.union(post.variants, 'voters');
	const likedByMe = !!_.find(post.likeVoters, voterId => voterId === userId);
	const votedByMe = !!_.find(voters, voterId => voterId === userId);

	const postResponse = {
		customId: post.customId,
		author: post.author, // TODO: Отдавать полноценного пользователя
		title: post.title,
		text: post.text,
		category: post.category,
		fromNow: moment(post.createdDate).locale(lang).fromNow(),
		likesAmount: post.likes,
		commentsAmount: post.comments.length,
		isLikedByMe: likedByMe,
		isVotedByMe: votedByMe
	};

	if (post.comments.length > 0) postResponse.comments = post.comments;
	if (post.variants.length > 0) {

		postResponse.variants = _.map(post.variants, variant => {
			let currentVoted = false;
			if (votedByMe)
				currentVoted = !!_.find(variant.voters, voterId => voterId === userId);

			const data = {
				value: variant.value,
				count: variant.count,
				voters: variant.voters
			};

			if (currentVoted) data.myVote = true;
			return data;
		});
	}

	if (post.likeVoters.length > 0) postResponse.likeVoters = post.likeVoters;
	if (post.logoUrl) postResponse.logoUrl = post.logoUrl;
	if (post.updatedDate) postResponse.updatedDate = post.updatedDate;

	return postResponse;
};
