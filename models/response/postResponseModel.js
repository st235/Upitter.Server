'use strict';

const _ = require('underscore');
const moment = require('moment');
const LocaleService = require('default-locale');
const companyResponse = require('./companyResponseModel');

module.exports = (userId, post, lang = 'en', author, commentsAmount) => {
	const likedByMe = !!_.find(post.likeVoters, voterId => voterId === userId);
	const favoriteByMe = !!_.find(post.favoriteVoters, voterId => voterId === userId);
	const votedByMe = !!_.find(post.votersForVariants, voterId => voterId === userId);
	const reportedByMe = !!_.find(post.reportVoters, voter => voter === userId);

	const postResponse = {
		customId: post.customId,
		author: author ? companyResponse(author) : post.author,
		title: post.title,
		text: post.text,
		category: LocaleService.getString(`${post.category}`, lang),
		coordinates: {
			latitude: post.location ? post.location[0] : null,
			longitude: post.location ? post.location[1] : null
		},
		fromNow: moment(post.createdDate).locale(lang).format('DD.MM.YYYY'),
		createdDate: post.createdDate,
		likesAmount: post.likes,
		votersAmount: post.votersForVariants.length,
		watchesAmount: post.watches,
		favoritesAmount: (post.favoriteVoters && post.favoriteVoters.length) ? post.favoriteVoters.length : 0,
		commentsAmount: commentsAmount || 0,
		isLikedByMe: likedByMe,
		isVotedByMe: votedByMe,
		isFavoriteByMe: favoriteByMe,
		isReportedByMe: reportedByMe
	};

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
