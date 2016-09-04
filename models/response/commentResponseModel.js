'use strict';

const userResponse = require('./userResponseModel');
const companyResponse = require('./companyResponseModel');
const commentAuthorResponse = require('./commentAuthorResponseModel');

module.exports = comment => {
	const commentResponse = {
		customId: comment.customId,
		text: comment.text,
		createdDate: comment.createdDate
	};
	if (comment.authorUser) commentResponse.author = commentAuthorResponse(comment.authorUser, 'User');
	if (comment.authorCompany) commentResponse.author = commentAuthorResponse(comment.authorCompany, 'Company');

	if (comment.replyToUser) commentResponse.replyTo = userResponse(comment.replyToUser);
	if (comment.replyToCompany) commentResponse.replyTo = companyResponse(comment.replyToCompany);

	if (comment.replyTo && comment.author.customId) commentResponse.replyTo = userResponse(comment.replyTo);

	return commentResponse;
};
