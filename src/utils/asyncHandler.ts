import { type Request, type Response, type NextFunction } from 'express'

interface RequestType {
	body: object
	params: object
	query: object
}

export type Req<T extends RequestType> = Request<T['params'], Record<string, unknown>, T['body'], T['query']>

const asyncHandler = <T>(fn: (req: T, res: Response, next: NextFunction) => void | Promise<void>): (req: T, res: Response, next: NextFunction) => void => {
	return (req: T, res: Response, next: NextFunction): void => {
		Promise.resolve(fn(req, res, next)).catch(next)
	}
}

export default asyncHandler
