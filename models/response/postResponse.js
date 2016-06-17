'use strict';

module.exports = post => {
	const postResponse = {
		customId: post.customId,
		title: post.title,
		text: post.text,
		createdDate: post.createdDate
	};

	if (post.logoUrl) postResponse.logoUrl = post.logoUrl;
	if (post.updatedDate) postResponse.updatedDate = post.updatedDate;

	return postResponse;
};