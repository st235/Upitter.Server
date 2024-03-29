'use strict';

const AppUnit = require('../../app/unit');
const DEFAULT_LANGUAGE = 'en';

class LanguageMiddleware extends AppUnit {
	_onBind() {
		this.obtainLanguage = this.obtainLanguage.bind(this);
	}

	obtainLanguage(req, res, next) {
		const ln = req.query.ln || req.body.ln;
		req.ln = ln || DEFAULT_LANGUAGE;
		return next();
	}
}

module.exports = LanguageMiddleware;
