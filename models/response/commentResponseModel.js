'use strict';

const userResponse = require('./userResponseModel');
const companyResponse = require('./companyResponseModel');
const commentAuthorResponse = require('./commentAuthorResponseModel');
const moment = require('moment');
const _ = require('underscore');

module.exports = (comment, ln = 'en', userId) => {
	const isReportedByMe = userId ? !!_.find(comment.reportVoters, voter => voter === userId) : false;
	const timeStamp = new Date(comment.createdDate).getTime();

	const commentResponse = {
		customId: comment.customId,
		text: comment.text,
		timeStamp: Math.ceil(timeStamp),
		createdDate: moment(comment.createdDate).locale(ln).calendar(),
		createdTime: moment(comment.createdDate).locale(ln).format('LT'),
		isReportedByMe
	};
	if (comment.authorUser) commentResponse.author = commentAuthorResponse(comment.authorUser, 'User');
	if (comment.authorCompany) commentResponse.author = commentAuthorResponse(comment.authorCompany, 'Company');

	if (comment.replyToUser) commentResponse.replyTo = userResponse(comment.replyToUser);
	if (comment.replyToCompany) commentResponse.replyTo = companyResponse(comment.replyToCompany);

	if (comment.replyTo && comment.author.customId) commentResponse.replyTo = userResponse(comment.replyTo);

	return commentResponse;
};
