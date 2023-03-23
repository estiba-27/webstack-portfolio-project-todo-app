import { Application } from "express";
import { RouteConfig } from "../common/route.config";
import userController from "../user/user.controller";
import todoController from "./todo.controller";

class TodoRoute extends RouteConfig {
	constructor(app: Application) {
		super(app, 'TodoRoutes')
	}

	registerRoute(): Application {
		this.app.use('/api', this.router)

		return this.app
	}
	configureRoutes(): void {
		this.router.route('/todo')
			.get(userController.authorization, todoController.getMyTodos)
			.post(userController.authorization, todoController.createTodo)
			.put(userController.authorization, todoController.toggleDone)
			.delete(userController.authorization, todoController.deleteItem)
	}
}

export default TodoRoute