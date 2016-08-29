'use strict';

const cors = require('cors');
const bodyParser = require('body-parser');
const routesConfig = require('../config/routes');

const AppUnit = require('./unit');

const AuthorizationMiddleware = require('../controllers/middlewares/authorizationMiddlerware');
const LanguageMiddleware = require('../controllers/middlewares/languageMiddleware');
const ErrorMiddleware = require('../controllers/middlewares/errorMiddleware');
const DebugMiddleware = require('../controllers/middlewares/debugMiddleware');

const AuthorizationController = require('../controllers/authorizationController');
const CategoryController = require('../controllers/categoryController');
const CommentController = require('../controllers/commentController');
const CompanyController = require('../controllers/companyController');
const FeedbackController = require('../controllers/feedbackController');
const LogController = require('../controllers/logController');
const PostController = require('../controllers/postController');
const FileController = require('../controllers/fileController');
const ServiceController = require('../controllers/serviceController');
const GeneralController = require('../controllers/generalController');
const ReportController = require('../controllers/reportController');
const UserController = require('../controllers/userController');

class AppRoutes extends AppUnit {
	constructor(app, managers) {
		super({ app, managers });
	}

	_onBind() {
		this.register = this.register.bind(this);

		this.registerHeader = this.registerHeader.bind(this);
		this.registerAuthorization = this.registerAuthorization.bind(this);
		this.registerCategory = this.registerCategory.bind(this);
		this.registerComment = this.registerComment.bind(this);
		this.registerCompany = this.registerCompany.bind(this);
		this.registerFeedback = this.registerFeedback.bind(this);
		this.registerLog = this.registerLog.bind(this);
		this.registerPost = this.registerPost.bind(this);
		this.registerReport = this.registerReport.bind(this);
		this.registerUser = this.registerUser.bind(this);
		this.registerFooter = this.registerFooter.bind(this);
	}

	_onCreate() {
		this.checkAuthorization = new AuthorizationMiddleware().authorize;
		this.getUser = new AuthorizationMiddleware().getUser;
		this.obtainLanguage = new LanguageMiddleware().obtainLanguage;
		this.errorHandler = new ErrorMiddleware();
		this.checkIfDebug = new DebugMiddleware().checkIfDebug;

		this.authorizationController = new AuthorizationController(this.managers.users, this.managers.companies);
		this.categoryController = new CategoryController(this.managers.categories);
		this.commentController = new CommentController(this.managers.comments, this.managers.users, this.managers.companies);
		this.companyController = new CompanyController(this.managers.companies);
		this.feedbackController = new FeedbackController(this.managers.feedback);
		this.logController = new LogController(this.managers.logs);
		this.postController = new PostController(this.managers.posts, this.managers.users, this.managers.companies);
		this.fileController = new FileController();
		this.generalController = new GeneralController();
		this.serviceController = new ServiceController();
		this.reportController = new ReportController(this.managers.reports, this.managers.users, this.managers.posts, this.managers.companies, this.managers.comments);
		this.userController = new UserController(this.managers.users, this.managers.companies);
	}

	register() {
		this.registerHeader(this.app);
		this.registerAuthorization(this.app, routesConfig.authorization, this.authorizationController);
		this.registerCategory(this.app, routesConfig.category, this.categoryController);
		this.registerComment(this.app, routesConfig.comment, this.commentController);
		this.registerCompany(this.app, routesConfig.company, this.companyController);
		this.registerFeedback(this.app, routesConfig.support, this.feedbackController);
		this.registerLog(this.app, routesConfig.support, this.logController);
		this.registerPost(this.app, routesConfig.post, this.postController);
		this.registerFile(this.app, routesConfig.file, this.fileController);
		this.registerGeneral(this.app, routesConfig.general, this.generalController);
		this.registerService(this.app, routesConfig.service, this.serviceController);
		this.registerReport(this.app, routesConfig.report, this.reportController);
		this.registerUser(this.app, routesConfig.user, this.userController);
		this.registerFooter(this.app);
	}

	registerHeader(app) {
		app.use(cors());
		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({ extended: true }));
		app.use(this.obtainLanguage);
	}

	registerAuthorization(app, paths, controller) {
		app.get(paths.verifyToken, controller.verifyToken);
		app.get(paths.refreshToken, controller.refreshToken);

		app.post(paths.googleVerify, controller.googleVerify);
		app.post(paths.facebookVerify, controller.facebookVerify);
		app.post(paths.twitterVerify, controller.twitterVerify);
		app.post(paths.vkVerify, controller.vkVerify);
		app.post(paths.authorizeByPhone, controller.authorizeByPhone);
		app.post(paths.verifyCode, controller.verifyCode);
		//DEBUG ROOT
		app.post(paths.verifyDevelopmentCode, this.checkIfDebug, controller.verifyDevelopmentCode);
		app.post(paths.addInfo, controller.addInfo);
	}

	registerCategory(app, paths, controller) {
		app.get(paths.obtain, controller.getCategories);
		app.get(paths.find, this.checkAuthorization, controller.findCategory);
		app.get(paths.getParent, this.checkAuthorization, controller.getParent);
	}

	registerComment(app, paths, controller) {
		app.post(paths.addComment, this.checkAuthorization, controller.addComment);
		app.post(paths.editComment, this.checkAuthorization, controller.editComment);
		app.post(paths.removeComment, this.checkAuthorization, controller.removeComment);
		app.get(paths.obtain, this.getUser, controller.obtain);
	}

	registerCompany(app, paths, controller) {
		app.get(paths.findByAlias, controller.findByAlias);

		app.post(paths.edit, this.checkAuthorization, controller.edit);
		app.post(paths.getSubscribers, this.checkAuthorization, controller.getSubscribers);
	}

	registerFeedback(app, paths, controller) {
		app.get(paths.getFeedback, this.checkAuthorization, controller.getFeedback);

		app.post(paths.feedback, this.checkAuthorization, controller.feedback);
	}

	registerLog(app, paths, controller) {
		app.get(paths.getLogs, this.checkAuthorization, controller.getLogs);

		app.post(paths.log, this.checkAuthorization, controller.log);
	}

	registerPost(app, paths, controller) {
		app.get(paths.remove, this.checkAuthorization, controller.remove);
		app.get(paths.findById, this.checkAuthorization, controller.findById);
		app.get(paths.obtain, this.getUser, controller.obtain);
		app.get(paths.obtainNew, this.getUser, controller.obtainNew);
		app.get(paths.obtainOld, this.getUser, controller.obtainOld);
		app.get(paths.like, this.checkAuthorization, controller.like);
		app.get(paths.watch, this.checkAuthorization, controller.watch);
		app.get(paths.vote, this.checkAuthorization, controller.voteForVariant);
		app.get(paths.favorite, this.checkAuthorization, controller.favorite);
		app.get(paths.obtainFavorites, this.checkAuthorization, controller.obtainFavorites);
		app.get(paths.obtainOldFavorites, this.checkAuthorization, controller.obtainOldFavorites);
		app.get(paths.obtainByCompany, this.getUser, controller.obtainByCompany);
		app.post(paths.create, this.checkAuthorization, controller.create);
		app.post(paths.edit, this.checkAuthorization, controller.edit);
	}

	registerFile(app, paths, controller) {
		app.get(paths.verifyFid, this.checkAuthorization, controller.getFileInfoByFid);
	}

	registerGeneral(app, paths, controller) {
		app.get(paths.getSocialInfo, this.checkAuthorization, controller.getSocialInfo);
	}

	registerService(app, paths, controller) {
		app.get(paths.version.get, this.checkAuthorization, controller.getVersionInfo);
		app.post(paths.version.set, this.checkAuthorization, controller.setVersionInfo);
	}

	registerReport(app, paths, controller) {
		app.get(paths.obtainReports, this.checkAuthorization, controller.obtainReports);
		app.get(paths.obtainReasons, this.checkAuthorization, controller.obtainReasons);
		app.post(paths.create, this.checkAuthorization, controller.create);
		app.get(paths.obtainTarget, this.checkAuthorization, controller.obtainTargetOfReport);
	}

	registerUser(app, paths, controller) {
		app.post(paths.edit, this.checkAuthorization, controller.edit);
		app.post(paths.toggleSubscription, this.checkAuthorization, controller.toggleSubscription);
		app.post(paths.getSubscriptions, this.checkAuthorization, controller.getSubscriptions);
	}

	registerFooter(app) {
		app.use(this.errorHandler.obtainError);
		app.use(this.errorHandler.handleError);
	}
}

module.exports = AppRoutes;
