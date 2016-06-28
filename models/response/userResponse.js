'use strict';

const _ = require('underscore');

module.exports = user => {
	const userResponse = {
		customId: user.customId,
		nickname: user.nickname,
		isVerify: user.isVerify,
		sex: user.sex
	};

	if (user.name) userResponse.name = user.name;
	if (user.surname) userResponse.surname = user.surname;
	if (user.email) userResponse.email = user.email;
	if (user.picture) userResponse.picture = user.picture;
	if (user.description) userResponse.description = user.description;
	if (user.token) userResponse.accessToken = user.token;
	//if (user.subscriptions[0].customId) {
	//	userResponse.subscriptions = _.map(user.subscriptions, (company) => {
	//		const obj = {
	//			customId: company.customId,
	//			name: company.name,
	//			activity: company.activity,
	//			logoUrl: company.logoUrl,
	//			isVerify: company.isVerify,
	//			coordinates: _.map(company.coordinates, (coordinates) => {
	//				return {
	//					latitude: coordinates.latitude,
	//					longitude: coordinates.longitude
	//				};
	//			})
	//		};
	//		if (company.description) obj.description = company.description;
	//		if (company.site) obj.site = company.site;
	//		return obj;
	//	});
	//}

	return userResponse;
};
