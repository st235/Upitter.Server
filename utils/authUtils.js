'use strict';

const secretUtils = require('./secretUtils');

const EXPIRE_DATE = 604800000;
const TEMPORARY_MODEL_EXPIRE_DATE = 86400000;

module.exports = {
	createToken(authorizationClient, userId) {
		const token = secretUtils.getUniqueHash(userId);

		return authorizationClient
			.set(token, userId)
			.then(() => authorizationClient.expire(token, EXPIRE_DATE))
			.then(() => token);
	},

	setOrgTempModel(authorizationClient, phone, model) {
		const serializedModel = JSON.stringify(model);

		return authorizationClient
			.set(phone, serializedModel)
			.then(() => authorizationClient.expire(token, TEMPORARY_MODEL_EXPIRE_DATE))
			.then(() => model);
	},

	getOrgTempModel(authorizationClient, phone) {
		return authorizationClient
			.get(phone)
			.then(model => {
				//TODO: Добавить правильные ошибки
				if (!model) return null;
				try {
					return JSON.parse(model);
				} catch (e) {
					throw new Error('Could not parse authModel. INTERNAL SERVER ERROR');
				}
			})
	}
};
