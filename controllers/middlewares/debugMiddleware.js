'use strict';

const AppUnit = require('../../app/unit');
const domainConfig = require('../../config/domain');

class DebugMiddleware extends AppUnit {
	_onBind() {
		this.checkIfDebug = this.checkIfDebug.bind(this);
	}

	checkIfDebug(req, res, next) {
		const isDebug = process.argv[2];
		if (isDebug && isDebug === 'isdebug') return next();
		else return res.redirect(domainConfig.baseUrl);
	}
}

module.exports = DebugMiddleware;
