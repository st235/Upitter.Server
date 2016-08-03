'use strict';

module.exports = mongoose => {
	const Schema = mongoose.Schema;

	const reportReasonsSchema = new Schema({
		customId: {
			type: String,
			unique: true
		},
		title: {
			type: String,
			required: true
		},
		type: {
			type: String,
			required: true
		}
	});

	return mongoose.model('ReportReasons', reportReasonsSchema);
};
