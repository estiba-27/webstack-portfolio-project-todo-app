import { NextFunction, Request, Response } from "express";
import logger from "../common/logger";
import { goodRequest, noGoodRequest, unauthorized } from "../common/response";
import { base64ToString } from "../common/string";
import { Database } from "../database";
import { User } from "./user.entity";
import { UserSession, UserSessionStatus } from "./user.session.entity";
import { v4 as uuid } from "uuid";

const UserRepository = Database.getRepository(User)
const UserSessionRepository = Database.getRepository(UserSession)


class UserController {
	async authorization(req: Request, res: Response, next: NextFunction) {
		logger.debug('add user object middleware')
		const { authorization } = req.headers

		const [bearer, string] = (authorization as string).split(' ')
		if (!string) {
			logger.debug('no auth string found')
			return unauthorized(res)
		}
		
		const { username, token } = JSON.parse(base64ToString(string))
		if (!username || !token) {
			logger.debug('no username and token found')
			return unauthorized(res)
		}
		
		const theUser = await UserRepository.findOneBy({ username: username })
		if (!theUser) {
			logger.debug('no user found')
			return unauthorized(res)
		}

		const sessions = await UserSessionRepository.findBy({ user: { id: theUser.id } })
		let active = false

		sessions.every(session => {
			active = session.compareTokenSync(token) && session.status === UserSessionStatus.Active
			active && (res.locals.userSession = session)
			return !active
		})

		if (active) {
			res.locals.user = theUser
			next()
		} else {
			logger.debug('no active session found')
			unauthorized(res)
		}
	}

	async createNewUser(req: Request, res: Response) {
		logger.debug('create new user')
		const { fullname, username, password } = req.body

		if (!fullname || !username || !password) return noGoodRequest(res, 'missing fields')
		if ((await UserRepository.findAndCountBy({ username }))[1] > 0) return noGoodRequest(res, 'username already used')

		const newUser = new User()
		newUser.fullname = fullname
		newUser.username = username
		await newUser.setPassword(base64ToString(password))

		await UserRepository.save(newUser)
		
		goodRequest(res)
	}

	async login(req: Request, res: Response) {
		logger.debug('login')
		const { username, password } = req.body

		const loginUser = await UserRepository.findOneBy({ username })
		if (!loginUser || !(await loginUser.comparePassword(base64ToString(password)))) return noGoodRequest(res, 'username/password incorrect')

		const token = uuid()
		const newSession = new UserSession()
		newSession.user = loginUser
		await newSession.setToken(token)

		await UserSessionRepository.save(newSession)
		
		goodRequest(res, ['token', token])
	}

	async resumeSession(req: Request, res: Response) {
		logger.debug('resume session')
		goodRequest(res)
	}

	async logout(req: Request, res: Response) {
		logger.debug('logout')
		const { userSession } = res.locals

		userSession.status = UserSessionStatus.Revoked
		await UserSessionRepository.save(userSession)

		goodRequest(res)
	}

	userInfo(req: Request, res: Response) {
		logger.debug('user info')

		goodRequest(res, ['user', res.locals.user])
	}
}

export default new UserController()