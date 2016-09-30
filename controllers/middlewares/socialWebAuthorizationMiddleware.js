'use strict';
const AppUnit = require('../../app/unit');

const Passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const VKontakteStrategy = require('passport-vkontakte').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const socialKeys = require('../../config/socialKeys');

class SocialAuthorizationMiddleware extends AppUnit {
	_onBind() {
		this.twitter = this.twitter.bind(this);
		this.vk = this.vk.bind(this);
		this.facebook = this.facebook.bind(this);
		this.google = this.google.bind(this);
	}

	twitter() {
		Passport.use(new TwitterStrategy({
			consumerKey: socialKeys.twitter.clientID,
			consumerSecret: socialKeys.twitter.clientSecret,
			callbackURL: '/authorization/twitter/web/verify'
		}, (token, tokenSecret, profile, cb) => cb(null, profile)));
	}

	vk() {
		Passport.use(new VKontakteStrategy({
			clientID: socialKeys.vk.clientID,
			clientSecret: socialKeys.vk.clientSecret,
			callbackURL: '/authorization/vk/web/verify',
			profileFields: ['id', 'username', 'first_name', 'last_name', 'sex', 'photo_max_orig']
		}, (accessToken, refreshToken, profile, cb) => cb(null, profile)));
	}

	facebook() {
		Passport.use(new FacebookStrategy({
			clientID: socialKeys.facebook.clientID,
			clientSecret: socialKeys.facebook.clientSecret,
			callbackURL: '/authorization/facebook/web/verify'
		}, (accessToken, refreshToken, profile, cb) => cb(null, profile)));
	}

	google() {
		Passport.use(new GoogleStrategy({
			clientID: socialKeys.google.clientID,
			clientSecret: socialKeys.google.clientSecret,
			callbackURL: '/authorization/google/web/verify'
		}, (accessToken, refreshToken, profile, cb) => cb(null, profile)));
	}
}

module.exports = SocialAuthorizationMiddleware;
