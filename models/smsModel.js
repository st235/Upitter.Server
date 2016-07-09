'use strict';

module.exports = mongoose => {
	const Schema = mongoose.Schema;

	const SmsSchema = new Schema({
		text: {
			type: String,
			required: true
		},
		phone: {
			type: String,
			required: true
		},
		sentDate: {
			type: Date,
			default: null
		},
		createdDate: {
			type: Date,
			default: Date.now
		}
	});

	SmsSchema.statics.findUnsent = function () {
		return this
			.find({ sentDate: null })
			.exec();
	};

	return mongoose.model('Sms', SmsSchema);
};

