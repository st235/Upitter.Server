'use strict';

const LocaleService = require('default-locale');

module.exports = (reason, language) => {

	const reasonResponse = {
		customId: reason.customId,
		title: LocaleService.getString(`REASON_${reason.customId}`, language)
	};

	if (reason.logoUrl) reasonResponse.logoUrl = reason.logoUrl;

	return reasonResponse;
};
