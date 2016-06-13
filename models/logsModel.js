'use strict';
const counterConfig = require('../config/counter');

module.exports = mongoose => {
	const Schema = mongoose.Schema;
	const logSchema = new Schema({
		customId: {
			type: Number,
			unique: true
		},
		createdDate: {
			type: Date,
			default: Date.now()
		},
		log: {
			type: String
		},
		trace: {
			type: String
		},
		systemType: {
			google: Number // 0: android, 1: ios
		}
	});

	logSchema.pre('save', function (next) {
		if (this.customId) return next();

		this
			.model('_Counters')
			.findAndModify(counterConfig.logs.name, counterConfig.logs.defaultIndex)
			.then(index => {
				this.customId = index;
				next();
			})
			.catch(error => next(error));
	});

	return mongoose.model('Logs', logSchema);
};
