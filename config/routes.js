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
		addComment: '/comment/create',
		editComment: '/comment/edit',
		removeComment: '/comment/remov'
	},
	company: {
		edit: '/company/edit',
		getSubscribers: '/company/subscribers',
		findByAlias: '/company/:alias'
	},
	post: {
		obtain: '/post/obtain',
		obtainNew: '/post/obtainNew',
		obtainOld: '/post/obtainOld',
		create: '/post/create',
		edit: '/post/edit',
		findById: '/post/find/:postId',
		remove: '/post/remove',
		like: '/post/like/:postId',
		watch: '/post/watch/:postId',
		favorite: '/post/favorite/:postId',
		vote: '/post/vote/:postId/:variantIndex'
	},
	report: {
		create: '/report/create',
		obtainReports: '/reports',
		obtainReasons: '/report/reasons/:type',
		obtainTarget: '/:type/:targetId'
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
	},
	file: {
		verifyFid: '/file/verify_fid'
	},
	general: {
		getSocialInfo: '/general/socialInfo/get'
	},
	external: {
		verifyFid: '/verification/fid/verify'
	}
};
