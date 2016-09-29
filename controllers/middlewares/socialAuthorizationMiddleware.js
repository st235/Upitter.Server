'use strict';
const AppUnit = require('../../app/unit');

const Passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const VKontakteStrategy = require('passport-vkontakte').Strategy;
const socialKeys = require('../../config/socialKeys');

class SocialAuthorizationMiddleware extends AppUnit {
	_onBind() {
		this.twitterWebAuth = this.twitterWebAuth.bind(this);
		this.vkWebAuth = this.vkWebAuth.bind(this);
	}

	twitterWebAuth() {
		Passport.use(new TwitterStrategy({
			consumerKey: socialKeys.twitter.consumerKey,
			consumerSecret: socialKeys.twitter.consumerSecret,
			callbackURL: '/authorization/twitter/web/verify'
		}, (token, tokenSecret, profile, cb) => cb(null, profile)));
	}

	vkWebAuth() {
		Passport.use(new VKontakteStrategy({
			clientID: socialKeys.vk.clientID,
			clientSecret: socialKeys.vk.clientSecret,
			callbackURL: '/authorization/vk/web/verify',
			profileFields: ['id', 'username', 'first_name', 'last_name', 'sex', 'photo_max_orig']
		}, (accessToken, refreshToken, profile, done) => done(null, profile)));
	}
}

module.exports = SocialAuthorizationMiddleware;
