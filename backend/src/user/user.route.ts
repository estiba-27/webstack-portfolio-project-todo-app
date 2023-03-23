import { Application } from "express";
import { RouteConfig } from "../common/route.config";
import userController from "./user.controller";

class UserRoute extends RouteConfig {
	constructor(app: Application) {
		super(app, 'UserRoutes')
	}

	registerRoute(): Application {
		this.app.use('/api', this.router)

		return this.app
	}
	configureRoutes(): void {
		this.router.route('/signup')
			.post(userController.createNewUser)

		this.router.route('/login')
			.post(userController.login)

		this.router.route('/resume-session')
			.post(userController.authorization, userController.resumeSession)

		this.router.route('/logout')
			.post(userController.authorization, userController.logout)

		this.router.route('/user')
			.get(userController.authorization, userController.userInfo)
	}
}

export default UserRoute