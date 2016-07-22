'use strict';

const _ = require('underscore');
const moment = require('moment');

const CompanyResponseModel = require('./companyResponseModel');

module.exports = (userId, post, lang = 'en') => {
	const likedByMe = !!_.find(post.likeVoters, voterId => voterId === userId);
	const votedByMe = !!_.find(post.votersForVariants, voterId => voterId === userId);

	const postResponse = {
		customId: post.customId,
		author: post.author,
		title: post.title,
		text: post.text,
		category: post.category,
		coordinates: {
			latitude: post.location[0],
			longitude: post.location[1]
		},
		fromNow: moment(post.createdDate).locale(lang).fromNow(),
		likesAmount: post.likes,
		commentsAmount: post.comments.length,
		votersAmount: post.votersForVariants.length,
		isLikedByMe: likedByMe,
		isVotedByMe: votedByMe,
		watchedCount: post.watches
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
	if (post.media && post.media.length) postResponse.media = post.media;

	return postResponse;
};
