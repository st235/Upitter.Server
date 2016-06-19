'use strict';

const path = require('path');
const errorsPath = path.join(__dirname, '../resources/errors');

module.exports = {
	CONTEXT: errorsPath,
	RESOURCE_FOLDER: 'static',
	RESOURCE_DEFAULT_FILE: 'static.js',
	RESOURCE_FILE_PREFIX: 'static.',
	RESOURCE_FILE_EXTENSION: '.js',
	localeList: ['en', 'ru']
};
