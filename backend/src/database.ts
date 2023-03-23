import "reflect-metadata";
import { DataSource } from "typeorm";
import { Todo } from "./todo/todo.entity";
import { User } from "./user/user.entity";
import { UserSession } from "./user/user.session.entity";

export const Database = new DataSource({
	type: 'mysql',
	username: 'todo',
	password: 'todo',
	database: 'todo',
	host: 'localhost',
	port: 3306,
	entities: [ User, UserSession, Todo ],
	synchronize: true,
	dropSchema: false,
})
