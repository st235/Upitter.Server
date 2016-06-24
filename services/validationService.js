const ValidationGenerator = require('validatron');
const settingsConfig = require('../config/settings');

module.exports = ValidationGenerator.createValidator({
	errorsList: {
		NO_PROPERTY_SUPPLIED: {
			name: 'PROPERTY_NOT_SUPPLIED'
		},
		NOT_EXISTS: {
			name: 'PROPERTY_NOT_SUPPLIED'
		},

		INVALID_TYPE: {
			name: 'PROPERTY_HAS_INCORRECT_TYPE'
		},

		INCORRECT_TYPE: {
			name: 'PROPERTY_HAS_INCORRECT_TYPE'
		},

		TOO_SHORT: {
			name: 'PROPERTY_OUT_OF_RANGE'
		},

		OUT_OF_RANGE: {
			name: 'PROPERTY_OUT_OF_RANGE'
		},

		IS_NOT_EQUAL: {
			name: 'IS_NOT_EQUAL'
		}
	},
	// env: settingsConfig.env,
	env: 'prod',
	returnAllErrors: false,
	errorFieldsToGet: ['name']
});