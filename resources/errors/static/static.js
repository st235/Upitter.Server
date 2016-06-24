module.exports = {
	UNKNOWN_ERROR: {
		internalDescription: 'Unknown error',
		externalDescription: 'Unknown error'
	},

	INTERNAL_SERVER_ERROR: {
		internalDescription: 'Internal server error',
		externalDescription: 'Internal server error'
	},

	PROPERTY_HAS_INCORRECT_TYPE: {
		internalDescription: 'Incorrect property type',
		externalDescription: 'Property has incorrect type'
	},

	PROPERTY_NOT_SUPPLIED: {
		internalDescription: 'Property was not supplied',
		externalDescription: 'Property was not supplied'
	},

	PROPERTY_OUT_OF_RANGE: {
		internalDescription: 'Property is out of range',
		externalDescription: 'Property is out of range'
	},

	IS_NOT_EQUAL: {
		internalDescription: 'Some property is not equal',
		externalDescription: 'Some property is not equal'
	},

	UNAUTHORIZED: {
		internalDescription: 'Query without authorization try to obtain router',
		externalDescription: 'Access denied.'
	},

	INCORRECT_CREDENTIALS: {
		internalDescription: 'Supplied login or password is incorrect',
		externalDescription: 'Login or password are incorrect'
	},

	INCORRECT_SMS_CODE: {
		internalDescription: 'Supplied sms code is incorrect',
		externalDescription: 'Supplied sms code is incorrect'
	},

	INVALID_TOKEN_FOR_TIMELINER: {
		internalDescription: 'Incorrect token for timeliner',
		externalDescription: 'Internal server error'
	},

	BAD_REQUEST_FOR_TIMELINER: {
		internalDescription: 'Some properties were not supplied, while sending request to timeliner',
		externalDescription: 'Internal server error'
	},

	TIMELINER_INNER_ERROR: {
		internalDescription: 'Internal timeliner error',
		externalDescription: 'Internal server error'
	},

	INVALID_TIMELINER_SECRET: {
		internalDescription: 'Secret key supplied to timeliner is incorrect',
		externalDescription: 'Internal server error'
	}
};