'use strict';

module.exports = (report) => {

	const reportResponse = {
		customId: report.customId,
		type: report.type,
		reason: report.reason[0],
		createdDate: report.createdDate,
		author: report.author[0]
	};

	if (report.type === 'company') reportResponse.company = report.companyId[0];
	if (report.type === 'comment') reportResponse.comment = report.commentId[0];
	if (report.type === 'post') reportResponse.post = report.postId[0];

	return reportResponse;
};
