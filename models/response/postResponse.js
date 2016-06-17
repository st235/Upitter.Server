'use strict';

module.exports = post => {
	const postResponse = {
		customId: post.customId,
		author: post.author,
		title: post.title,
		text: post.text,
		createdDate: post.createdDate,
		comments: post.comments
	};

	if (post.logoUrl) postResponse.logoUrl = post.logoUrl;
	if (post.updatedDate) postResponse.updatedDate = post.updatedDate;

	return postResponse;
};
