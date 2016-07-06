'use strict';

const _ = require('underscore');

module.exports = post => {
	console.log(post);
	const postResponse = {
		customId: post.customId,
		author: post.author,
		title: post.title,
		text: post.text,
		createdDate: post.createdDate,
		rating: post.rating
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
	if (post._voters.length > 0) postResponse._voters = post._voters;
	if (post.logoUrl) postResponse.logoUrl = post.logoUrl;
	if (post.updatedDate) postResponse.updatedDate = post.updatedDate;

	return postResponse;
};
