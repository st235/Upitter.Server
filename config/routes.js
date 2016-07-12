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
	category: {
		obtain: '/categories',
		find: '/categories/find/:id',
		getParent: '/categories/get/parent/:id'
	},
	comment: {
		obtain: '/comments',
		create: '/comment/create',
		remove: '/comment/remove'
	},
	company: {
		edit: '/company/edit',
		getSubscribers: '/company/subscribers',
		findByAlias: '/company/:aliasId'
	},
	post: {
		obtain: '/post/obtain',
		create: '/post/create',
		edit: '/post/edit',
		remove: '/post/remove',
		like: '/post/like/:postId',
		favorite: '/post/favorite/:postId',
		vote: '/post/vote/:postId/:variantIndex',
		comment: '/post/comment'
	},
	support: {
		support: '/support',
		log: '/support/:systemType/:id',
		getLogs: '/support/log/get',
		feedback: '/support/feedback',
		getFeedback: '/support/feedback/get'
	},
	user: {
		edit: '/user/edit',
		addToSubscriptions: '/user/subscribe/:companyId',
		removeFromSubscriptions: '/user/unsubscribe/:companyId',
		getSubscriptions: '/user/subscriptions'
	}
};
