'use strict';
const counterConfig = require('../config/counter');

module.exports = mongoose => {
	const Schema = mongoose.Schema;
	const coordinatesSchema = new Schema({
		customId: {
			type: String,
			unique: true,
			required: true
		},
		name: {
			type: String
		},
		latitude: {
			type: String
		},
		longitude: {
			type: String
		}
	});

	coordinatesSchema.pre('save', function (next) {
		if (this.customId) return next();

		this
			.model('_Counters')
			.findAndModify(counterConfig.coordinates.name, counterConfig.coordinates.defaultIndex)
			.then(index => {
				this.customId = index;
				next();
			})
			.catch(error => next(error));
	});

	return mongoose.model('Coordinates', coordinatesSchema);
};
