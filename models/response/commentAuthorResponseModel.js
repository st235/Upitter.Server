'use strict';

module.exports = (author, type) => {
	const response = {
		customId: author.customId,
		alias: (type === 'Company') ? author.alias : null,
		name: (type === 'User') ? author.nickname : author.name,
		logoUrl: (type === 'User') ? author.picture || null : author.logoUrl || null
	};

	return response;
};
