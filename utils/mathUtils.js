const _ = require('underscore');

module.exports = {

	inCollection(collection, criterion, value) {
		const inCollection = _.find(collection, item => item[criterion] === value);
		if (inCollection) return inCollection;
		return false;
	}
};
