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
			type: Date
		},
		resolved: {
			type: Boolean,
			default: false
		}
	});

	logSchema.statics.findUnique = function (logId, systemType) {
		return this
			.findOne({ logId, systemType })
			.exec();
	};

	logSchema.statics.getLogs = function (limit, offset) {
		return this
			.find()
			.sort({ createdDate: -1 })
			.skip(offset)
			.limit(limit)
			.exec();
	};

	return mongoose.model('Logs', logSchema);
};
