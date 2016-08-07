'use strict';

const _ = require('underscore');
const moment = require('moment');

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
		fromNow: moment(post.createdDate).locale(lang).format('DD.MM.YYYY'),
		likesAmount: post.likes,
		commentsAmount: post.comments.length,
		votersAmount: post.votersForVariants.length,
		isLikedByMe: likedByMe,
		isVotedByMe: votedByMe,
		watchesAmount: post.watches
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
	if (post.images && post.images.length) postResponse.images = _.map(post.images, image => {
		return {
			fid: image.fid,
			uuid: image.uuid,
			width: image.width,
			height: image.height,
			aspectRatio: image.aspectRatio,
			type: image.type,
			originalUrl: image.originalUrl,
			thumbUrl: image.thumbUrl
		}
	});

	return postResponse;
};
