'use strict';

module.exports = (author, type) => {
	return {
		customId: author.customId,
		name: (type === 'User') ? author.nickname : author.name,
		logoUrl: author.logoUrl
	};
};
