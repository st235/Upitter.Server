module.exports = {
	authorization: {
		verifyToken: '/authorization/token/verify/:token',
		refreshToken: '/authorization/token/refresh/:token',
		googleVerify: '/authorization/google/verify',
		facebookVerify: '/authorization/facebook/verify',
		twitterVerify: '/authorization/twitter/verify',
		vkVerify: '/authorization/vk/verify',
		authorizeByPhone: '/authorization/phone/set/:number/:countryCode',
		verifyCode: '/authorization/phone/verify/:number/:countryCode',
		//DEBUG ROOT
		verifyDevelopmentCode: '/debug/authorization/phone/verify_development/:number/:countryCode',
		addInfo: '/authorization/phone/add_info/:number/:countryCode',
		web: {
			twitter: {
				auth: '/authorization/twitter/web',
				verify: '/authorization/twitter/web/verify'
			},
			vk: {
				auth: '/authorization/vk/web',
				verify: '/authorization/vk/web/verify'
			},
			facebook: {
				auth: '/authorization/facebook/web',
				verify: '/authorization/facebook/web/verify'
			},
			google: {
				auth: '/authorization/google/web',
				verify: '/authorization/google/web/verify'
			}
		}
	},
	category: {
		obtain: '/categories',
		obtainTitles: '/categories/obtainTitles',
		find: '/categories/find/:id',
		getParent: '/categories/get/parent/:id'
	},
	comment: {
		addComment: '/comment/create',
		editComment: '/comment/edit',
		removeComment: '/comment/remove',
		obtain: '/comments'
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
		obtainFavorites: '/post/favorites',
		obtainOldFavorites: '/post/favoritesOld',
		obtainByCompany: '/post/obtainByCompany/:type',
		obtainByAlias: '/post/obtainByAlias/:type',
		vote: '/post/vote/:postId/:variantIndex',
		obtainPostsBySubscriptions: '/post/obtainBySubscriptions'
	},
	report: {
		create: '/report/create',
		obtainReports: '/reports',
		obtainReasons: '/report/reasons/:type',
		obtainTarget: '/report/:type/:targetId'
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
	service: {
		version: {
			get: '/service/info/android/get/v',
			set: '/service/info/android/set/v'
		}
	},
	external: {
		verifyFid: '/verification/fid/verify'
	}
};
