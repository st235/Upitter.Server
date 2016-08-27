'use strict';

const userResponse = require('./userResponseModel');

module.exports = comment => {
	const commentResponse = {
		customId: comment.customId,
		author: comment.author.customId ? userResponse(comment.author) : comment.author,
		text: comment.text,
		createdDate: comment.createdDate
	};

	if (comment.replyTo && comment.author.customId) commentResponse.replyTo = userResponse(comment.replyTo);

	return commentResponse;
};
