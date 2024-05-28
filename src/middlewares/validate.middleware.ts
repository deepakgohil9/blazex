import { type Request, type Response, type NextFunction, type RequestHandler } from 'express'
import { type AnyZodObject, type ZodError, type ZodIssue } from 'zod'
import { HttpException, httpErrors } from '../utils/HttpException'

const validate = (schema: AnyZodObject): RequestHandler => {
	return (req: Request, res: Response, next: NextFunction) => {
		try {
			schema.parse({
				body: req.body,
				params: req.params,
				query: req.query
			})
			next()
		} catch (error) {
			const messages = (error as ZodError).errors.map((err: ZodIssue): string => err.message)
			const message = messages.join(', ')
			throw new HttpException(httpErrors.BAD_REQUEST, message)
		}
	}
}

export default validate
