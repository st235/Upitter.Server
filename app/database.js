'use strict';

const mongoose = require('mongoose');
const databaseConfig = require('../config/database');

class AppDatabase {
	constructor() {
		const db = mongoose.connect(databaseConfig.uri, databaseConfig.options);
	}

	managers() {
		return {

		};
	}
}

module.exports = AppDatabase;
