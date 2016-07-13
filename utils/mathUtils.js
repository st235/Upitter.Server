const _ = require('underscore');

module.exports = {

	inCollection(collection, criterion, value) {
		const inCollection = _.find(collection, item => item[criterion] === value);
		if (inCollection) return inCollection;
		return false;
	},

	union(collection, predicate) {
		if (!collection) return [];

		let result = [];
		_.each(collection, object => {
			if (!object[predicate]) return;
			_.each(object[predicate], item => result.push(item));
		});

		return result;
	}
};
