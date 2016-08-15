'use strict';

module.exports = comment => {
	const commentResponse = {
		customId: comment.customId,
		author: comment.author,
		text: comment.text,
		createdDate: comment.createdDate
	};

	if (comment.replyTo && comment.replyTo.customId && comment.replyTo.nickname) commentResponse.replyTo = comment.replyTo;

	return commentResponse;
};
