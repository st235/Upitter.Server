'use strict';

const counterConfig = require('../config/counter');

module.exports = mongoose => {
	const Schema = mongoose.Schema;

	const mediaSchema = new Schema({
		customId: {
			type: String,
			unique: true,
			required: true
		},
		type: {
			type: String
		},
		url: {
			type: String
		}
	});

	mediaSchema.pre('save', function (next) {
		if (this.customId) return next();

		this
			.model('_Counters')
			.findAndIncrement(counterConfig.media.name, counterConfig.media.defaultIndex)
			.then(index => {
				this.customId = index;
				next();
			})
			.catch(error => next(error));
	});

	return mongoose.model('Media', mediaSchema);
};
