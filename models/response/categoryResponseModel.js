'use strict';

const LocaleService = require('default-locale');

module.exports = (category, language) => {
	try {
		const categoryResponse = {
			customId: category.customId,
			title: LocaleService.getString(`CATEGORY_${category.customId}`, language)
		};

		if (category.parentCategory) categoryResponse.parentCategory = category.parentCategory;
		if (category.logoUrl) categoryResponse.logoUrl = category.logoUrl;

		return categoryResponse;
	}
	catch(e) {
		return ;
	}
};
