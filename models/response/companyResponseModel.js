'use strict';

const _ = require('underscore');

module.exports = (company, user) => {
	const isMySubscription = user ? !!_.find(company.subscribers, subscriber => subscriber.toString() === user._id.toString()) : false;
	const isReportedByMe = user ? !!_.find(company.reportVoters, voter => voter === user.customId.toString()) : false;

	const companyResponse = {
		customId: company.customId,
		alias: company.alias,
		activity: company.activity,
		name: company.name,
		isVerify: company.isVerify,
		rating: company.rating,
		moderatorsList: company.moderatorsList,
		coordinates: _.map(company.coordinates, coordinates => {
			return {
				address: coordinates.address,
				latitude: coordinates.latitude,
				longitude: coordinates.longitude
			};
		}),
		subscribersAmount: '0',
		isMySubscription,
		isReportedByMe
	};

	if (company.logoUrl) companyResponse.logoUrl = company.logoUrl;
	if (company.description) companyResponse.description = company.description;
	if (company.site) companyResponse.site = company.site;
	if (company.contactPhones) companyResponse.contactPhones = company.contactPhones;
	if (company.accessToken) companyResponse.accessToken = company.accessToken;
	if (company.socialLinks) companyResponse.socialLinks = company.socialLinks;

	if (company.subscribers && company.subscribers.length) {
		if (company.subscribers.length < 1000) companyResponse.subscribersAmount = company.subscribers.length.toString();
		else if (company.subscribers.length < 1000000) companyResponse.subscribersAmount = Math.round(company.subscribers.length / 1000) + 'k';
		else companyResponse.subscribersAmount = Math.round(company.subscribers.length / 1000000) + 'M';
	}

	if (company.subscribers && company.subscribers.length && company.subscribers[0].customId) {
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
