'use strict';

module.exports = mongoose => {
	const Schema = mongoose.Schema;

	const logSchema = new Schema({
		logId: {
			type: String,
			required: true,
			unique: true
		},
		systemType: {
			type: String,
			required: true
		},
		log: {
			type: String,
			required: true
		},
		createdDate: {
			type: Date,
			default: Date.now()
		}
	});

	logSchema.statics.findUnique = function (logId, systemType) {
		return this.findOne({ logId, systemType }).exec();
	};

	return mongoose.model('Logs', logSchema);
};
