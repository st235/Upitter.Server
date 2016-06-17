'use strict';
const counterConfig = require('../config/counter');

module.exports = mongoose => {
	const Schema = mongoose.Schema;
	const votesSchema = new Schema({
		customId: {
			type: String,
			unique: true,
			required: true
		},
		quizVariants: {
			type: [String]
		},
		votersNumber: {
			type: [String]
		},
		createdDate: {
			type: Date
		},
		updatedDate: {
			type: Date
		}
	});

	votesSchema.pre('save', function (next) {
		if (this.customId) return next();

		this
			.model('_Counters')
			.findAndModify(counterConfig.votes.name, counterConfig.votes.defaultIndex)
			.then(index => {
				this.customId = index;
				next();
			})
			.catch(error => next(error));
	});

	return mongoose.model('Votes', votesSchema);
};
