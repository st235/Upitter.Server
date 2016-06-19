'use strict';

const AppUnit = require('../../app/unit');

class LanguageMiddleware extends AppUnit {
	_onBind() {
		this.obtainLanguage = this.obtainLanguage.bind(this);
	}

	obtainLanguage(req, res, next) {
		const language = req.query.ln || req.body.ln;
		req.ln = language;
		return next();
	}
}

module.exports = LanguageMiddleware;
