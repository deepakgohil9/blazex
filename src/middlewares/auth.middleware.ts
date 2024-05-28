import { type Request, type Response, type NextFunction } from 'express'
import { verifyToken } from '../utils/jwt.utils'
import { HttpException, httpErrors } from '../utils/HttpException'

const auth = (req: Request, res: Response, next: NextFunction): void => {
	const authorization = req.headers.authorization
	if (authorization === null || authorization === undefined) {
		throw new HttpException(httpErrors.UNAUTHORIZED, 'No access token provided')
	}

	const accessToken = authorization.replace(/^Bearer\s/, '')
	const payload = verifyToken(accessToken, 'access')
	if (payload === null) {
		throw new HttpException(httpErrors.UNAUTHORIZED, 'Invalid access token')
	}

	res.locals.user = payload
	next()
}

export default auth
