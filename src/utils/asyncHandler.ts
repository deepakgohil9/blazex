import { type Response, type NextFunction } from 'express'

const asyncHandler = <T>(fn: (req: T, res: Response, next: NextFunction) => void | Promise<void>): (req: T, res: Response, next: NextFunction) => void => {
	return (req: T, res: Response, next: NextFunction): void => {
		Promise.resolve(fn(req, res, next)).catch(next)
	}
}

export default asyncHandler
