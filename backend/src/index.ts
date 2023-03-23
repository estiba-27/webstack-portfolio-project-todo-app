import express from 'express'
import { createServer } from 'http'
import logger from './common/logger'
import morgan from 'morgan'
import { RouteConfig } from './common/route.config'
import { errorHandler } from './middleware/errorHandler'
import { Database } from './database'
import UserRoute from './user/user.route'
import cors from 'cors'
import TodoRoute from './todo/todo.route'

const routes: Array<RouteConfig> = []

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use(morgan('combined', {
	stream: {
		write: (message: string) => {
			logger.info(message.trim());
		},
	}
}))


routes.push(new UserRoute(app))
routes.push(new TodoRoute(app))
app.use(errorHandler)


Database.initialize()
	.then(() => {
		logger.info('database connected')
		server.listen(3000, () => {
			logger.info('server started')
			routes.forEach(route => {
				logger.info(`${route.getName()} configured`)
			})
		})
	})
	.catch(err => {
		logger.error('database conneciton failed')
		logger.error(err.toString())
	})


const server = createServer(app)