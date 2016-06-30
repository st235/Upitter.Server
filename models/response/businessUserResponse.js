'use strict';

const _ = require('underscore');

module.exports = businessUser => {
	const businessUserResponse = {
		customId: businessUser.customId,
		activity: businessUser.activity,
		name: businessUser.name,
		isVerify: businessUser.isVerify,
		moderatorsList: businessUser.moderatorsList,
		coordinates: _.map(businessUser.coordinates, (coordinates) => {
			return {
				latitude: coordinates.latitude,
				longitude: coordinates.longitude
			};
		})
	};
	if (businessUser.description) businessUserResponse.description = businessUser.description;
	if (businessUser.logoUrl) businessUserResponse.logoUrl = businessUser.logoUrl;
	if (businessUser.subscribers[0] && businessUser.subscribers[0].customId) {
		businessUserResponse.subscribers = _.map(businessUser.subscribers, (user) => {
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
	return businessUserResponse;
};
