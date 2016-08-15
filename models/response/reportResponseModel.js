'use strict';

module.exports = (report) => {

	const reportResponse = {
		customId: report.customId,
		type: report.type,
		author: report.author,
		reason: report.reason,
		targetId: report.targetId,
		createdDate: report.createdDate
	};

	return reportResponse;
};
