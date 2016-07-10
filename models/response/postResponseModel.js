'use strict';

const _ = require('underscore');
const CompanyResponseModel = require('./companyResponseModel');

module.exports = (userId, post) => {
	const inVoters = !!_.find(post.voters, voterId => voterId === userId);

	const postResponse = {
		customId: post.customId,
		author: post.author,
		title: post.title,
		text: post.text,
		category: post.category,
		createdDate: post.createdDate,
		likes: post.rating, 	//  TODO: Изменить нейминг поля rating (непонятный).
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

	if (post.voters.length > 0) postResponse.voters = post.voters;
	if (post.votersForVariants > 0) postResponse.votersForVariants = post.votersForVariants;
	if (post.logoUrl) postResponse.logoUrl = post.logoUrl;
	if (post.updatedDate) postResponse.updatedDate = post.updatedDate;

	return postResponse;
};
