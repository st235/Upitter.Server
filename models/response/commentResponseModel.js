'use strict';

module.exports = comment => {
	const commentResponse = {
		customId: comment.customId,
		author: comment.author,
		text: comment.text,
		createdDate: comment.createdDate
	};

	return commentResponse;
};
