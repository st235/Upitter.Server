'use strict';

class LanguageMiddleware {
	constructor() {
		this.obtainLanguage = this.obtainLanguage.bind(this);
	}

	obtainLanguage(req, res, next) {
		const language = req.query.ln || req.body.ln;
		req.ln = language;
		return next();
	}
}

module.exports = LanguageMiddleware;
