module.exports = {
	authorization: {
		verifyToken: '/authorization/token/verify/:token',
		refreshToken: '/authorization/token/refresh/:token',
		googleVerify: '/authorization/google/verify',
		facebookVerify: '/authorization/facebook/verify',
		twitterVerify: '/authorization/twitter/verify',

		authorizeByPhone: '/authorization/phone/set/:number/:countryCode',
		verifyCode: '/authorization/phone/verify/:number/:countryCode',
		addInfo: '/authorization/phone/add_info/:number/:countryCode'
	},
	support: {
		support: '/support',
		log: '/support/:systemType/:id',
		getLogs: '/support/log/get',
		feedback: '/support/feedback',
		getFeedbacks: '/support/feedback/get'
	},
	user: {
		edit: '/user/edit'
	}
};
