'use strict';

module.exports = category => {
	const categoryResponse = {
		customId: category.customId,
		title: category.title,
		parentCategory: category.parentCategory
	};

	return categoryResponse;
};
