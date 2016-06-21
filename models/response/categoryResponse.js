'use strict';

module.exports = category => {
	const categoryResponse = {
		customId: category.customId,
		title: category.title
	};

	if (category.parentCategory) categoryResponse.parentCategory = category.parentCategory;
	if (category.logoUrl) categoryResponse.logoUrl = category.logoUrl;

	return categoryResponse;
};
