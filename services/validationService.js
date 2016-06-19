const ValidationGenerator = require('validatron');
const settingsConfig = require('../config/settings');
// const errorsConfig = require('../resources/errors/errors');

module.exports = ValidationGenerator.createValidator({
	errorsList: {
	},
	env: settingsConfig.env,
	returnAllErrors: false,
	errorFieldsToGet: ['name', 'innerCode', 'message']
});

