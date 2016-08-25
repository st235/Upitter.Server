'use strict';

const _ = require('underscore');
const moment = require('moment');
const commentResponse = require('./commentResponseModel');
const companyResponse = require('./companyResponseModel');

module.exports = (userId, post, lang = 'en', author) => {
	const likedByMe = !!_.find(post.likeVoters, voterId => voterId === userId);
	const favoriteByMe = !!_.find(post.favoriteVoters, voterId => voterId === userId);
	const votedByMe = !!_.find(post.votersForVariants, voterId => voterId === userId);

	const postResponse = {
		customId: post.customId,
		author: author ? companyResponse(author) : post.author,
		title: post.title,
		text: post.text,
		category: post.category,
		coordinates: {
			latitude: post.location[0],
			longitude: post.location[1]
		},
		fromNow: moment(post.createdDate).locale(lang).format('DD.MM.YYYY'),
		likesAmount: post.likes,
		votersAmount: post.votersForVariants.length,
		watchesAmount: post.watches,
		favoritesAmount: (post.favoriteVoters && post.favoriteVoters.length) ? post.favoriteVoters.length : 0,
		isLikedByMe: likedByMe,
		isVotedByMe: votedByMe,
		isFavoriteByMe: favoriteByMe
	};

	//if (post.comments && post.comments.comments.length > 0) {
	//	postResponse.comments = _.compact(_.map(post.comments.comments, comment => {
	//		if (comment.isRemoved === false) return commentResponse(comment);
	//	}));
	//	postResponse.commentsAmount = postResponse.comments.length;
	//} else {
	//	postResponse.commentsAmount = 0;
	//	postResponse.comments = [];
	//}

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
	if (post.favoriteVoters.length > 0) postResponse.favoriteVoters = post.favoriteVoters;
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
		};
	});

	return postResponse;
};
