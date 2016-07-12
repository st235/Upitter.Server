'use strict';

const mathUtils = require('../utils/mathUtils');

module.exports = mongoose => {
	const Schema = mongoose.Schema;

	const counterSchema = new Schema({
		collections: {
			type: [{
				name: {
					type: String,
					required: true,
					unique: true
				},
				index: {
					type: Number,
					required: true
				}
			}],
			default: []
		}
	});

	counterSchema.statics.findAndIncrement = function (name, index = 0) {
		return this
			.findOne()
			.exec()
			.then(counterModel => {
				if (mathUtils.inCollection(counterModel.collections, 'name', name)) return counterModel;
				counterModel.collections.push({ name, index });
				return counterModel.save();
			})
			.then(() => this.findOneAndUpdate({ 'collections.name': name }, { $inc: { 'collections.$.index': 1 } }, { new: true }).exec())
			.then(counterModel => mathUtils.inCollection(counterModel.collections, 'name', name))
			.then(counter => counter.index);
	};

	counterSchema.statics.findAndDecrement = function (name, index = 0) {
		return this
			.findOne()
			.exec()
			.then(counterModel => {
				if (mathUtils.inCollection(counterModel.collections, 'name', name)) return counterModel;
				counterModel.collections.push({ name, index });
				return counterModel.save();
			})
			.then(() => this.findOneAndUpdate({ 'collections.name': name }, { $inc: { 'collections.$.index': -1 } }, { new: true }).exec())
			.then(counterModel => mathUtils.inCollection(counterModel.collections, 'name', name))
			.then(counter => counter.index);
	};


	counterSchema.statics.create = function () {
		return this
			.findOne()
			.exec()
			.then(counterModel => {
				if (!counterModel) return new this().save();
				return counterModel;
			});
	};

	return mongoose.model('_Counters', counterSchema);
};
