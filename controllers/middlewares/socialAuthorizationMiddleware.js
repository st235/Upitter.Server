'use strict';
const AppUnit = require('../../app/unit');

const Passport = require('passport');
const Strategy = require('passport-twitter').Strategy;
const socialKeys = require('../../config/socialKeys');

class SocialAuthorizationMiddleware extends AppUnit {
	_onBind() {
		this.twitterAuth = this.twitterAuth.bind(this);
	}

	twitterAuth() {
		Passport.use(new Strategy({
			consumerKey: socialKeys.twitter.consumerKey,
			consumerSecret: socialKeys.twitter.consumerSecret,
			callbackURL: '/authorization/twitter/web/verify'
		}, (token, tokenSecret, profile, cb) => {
			return cb(null, profile);
		}));
	}
}

module.exports = SocialAuthorizationMiddleware;
