'use strict';

const AppUnit = require('../../app/unit');
const domainConfig = require('../../config/domain');

class DebugMiddleware extends AppUnit {
	_onBind() {
		this.checkIfDebug = this.checkIfDebug.bind(this);
	}

	checkIfDebug(req, res, next) {
		const isDebug = process.env.isDebug;
		if (isDebug) return next();
		else return res.redirect(domainConfig.baseUrl);
	}
}

module.exports = DebugMiddleware;
