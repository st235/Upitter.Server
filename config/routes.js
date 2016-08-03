module.exports = {
	authorization: {
		verifyToken: '/authorization/token/verify/:token',
		refreshToken: '/authorization/token/refresh/:token',
		googleVerify: '/authorization/google/verify',
		facebookVerify: '/authorization/facebook/verify',
		twitterVerify: '/authorization/twitter/verify',

		authorizeByPhone: '/authorization/phone/set/:number/:countryCode',
		verifyCode: '/authorization/phone/verify/:number/:countryCode',
		//DEBUG ROOT
		verifyDevelopmentCode: '/debug/authorization/phone/verify_development/:number/:countryCode',
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
		obtainNew: '/post/obtainNew',
		obtainOld: '/post/obtainOld',
		create: '/post/create',
		edit: '/post/edit',
		remove: '/post/remove',
		like: '/post/like/:postId',
		watch: '/post/watch/:postId',
		favorite: '/post/favorite/:postId',
		vote: '/post/vote/:postId/:variantIndex',
		comment: '/post/comment'
	},
	report: {
		obtain: '/report',
		obtainReasons: '/report/reasons/:reportType',
		create: '/report/create'
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
		toggleSubscription: '/user/toggle_subscription/:companyId',
		getSubscriptions: '/user/subscriptions'
	}
};
