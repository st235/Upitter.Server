'use strict';

const _ = require('underscore');

class AppUnit {
	constructor(args) {
		this._onInit = this._onInit.bind(this);
		this._onInit(args);
		if (this._onBind) this._onBind();
		if (this._onCreate) this._onCreate();
	}

	_onInit(args) {
		_.extend(this, args);
	}
}

module.exports = AppUnit;
