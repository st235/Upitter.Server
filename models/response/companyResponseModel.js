'use strict';

const _ = require('underscore');

module.exports = company => {
	const companyResponse = {
		customId: company.customId,
		activity: company.activity,
		name: company.name,
		isVerify: company.isVerify,
		moderatorsList: company.moderatorsList,
		coordinates: _.map(company.coordinates, coordinates => {
			return {
				address: coordinates.address,
				latitude: coordinates.latitude,
				longitude: coordinates.longitude
			};
		})
	};

	if (company.logoUrl) companyResponse.logoUrl = company.logoUrl;
	if (company.description) companyResponse.description = company.description;
	if (company.site) companyResponse.site = company.site;
	if (company.contactPhones) companyResponse.contactPhones = company.contactPhones;
	if (company.accessToken) companyResponse.accessToken = company.accessToken;
	if (company.subscribers.length > 0 && company.subscribers[0].customId) {
		companyResponse.subscribers = _.map(company.subscribers, user => {
			const obj = {
				customId: user.customId,
				nickname: user.nickname,
				sex: user.sex
			};
			if (user.name) obj.name = user.name;
			if (user.surname) obj.surname = user.surname;
			if (user.email) obj.email = user.email;
			if (user.picture) obj.picture = user.picture;
			if (user.description) obj.description = user.description;
			return obj;
		});
	}

	return companyResponse;
};
