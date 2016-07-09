'use strict';

module.exports = vote => {
	const voteResponse = {
		customId: vote.customId,
		quizVariants: vote.quizVariants,
		votersNumber: vote.votersNumber,
		createdDate: vote.createdDate
	};

	if (vote.updatedDate) voteResponse.updatedDate = vote.updatedDate;

	return voteResponse;
};
