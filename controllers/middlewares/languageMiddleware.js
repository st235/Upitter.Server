'use strict';

const AppUnit = require('../../app/unit');

class LanguageMiddleware extends AppUnit {
	_onBind() {
		this.obtainLanguage = this.obtainLanguage.bind(this);
	}

	obtainLanguage(req, res, next) {
		req.ln = req.query.ln || req.body.ln;
		return next();
	}
}

module.exports = LanguageMiddleware;
