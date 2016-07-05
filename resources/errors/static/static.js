module.exports = {
	UNKNOWN_ERROR: {
		internalDescription: 'Unknown error',
		externalDescription: 'Unknown error'
	},

	INTERNAL_SERVER_ERROR: {
		internalDescription: 'Internal server error',
		externalDescription: 'Internal server error'
	},

	INTERNAL_REDIS_ERROR: {
		internalDescription: 'Something went wrong with redis',
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

	PHONE_NOT_FOUND: {
		internalDescription: 'Phone number was not found',
		externalDescription: 'User with such number doesn\'t exist'
	},

	NUMBER_OF_ATTEMPTS_EXCEEDED: {
		internalDescription: 'Number of code entering attempts exceeded',
		externalDescription: 'Number of attempts exceeded'
	},

	USER_ALREADY_EXISTS: {
		internalDescription: 'Business account with such phone already exists',
		externalDescription: 'User already exists'
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

	NO_TEMPORARY_TOKEN_IN_DB: {
		internalDescription: 'Temporary token doesn\'t exist in database',
		externalDescription: 'Access denied'
	},

	INVALID_TEMPORARY_TOKEN: {
		internalDescription: 'The supplied temporary token doesn\'t match',
		externalDescription: 'Access denied'
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
	},

	REQUEST_SERVICE_ERROR: {
		internalDescription: 'Request service error',
		externalDescription: 'Internal server error'
	},

	SMS_SERVICE_ERROR: {
		internalDescription: 'Error in SMS-service',
		externalDescription: 'Internal server error'
	},

	SUBSCRIBE_ERROR_1: {
		internalDescription: 'User is already subscribed to this company',
		externalDescription: 'You are already subscribed to this company'
	},

	SUBSCRIBE_ERROR_2: {
		internalDescription: 'User has not subscribed to this company',
		externalDescription: 'You have not subscribed to this company'
	}
};
