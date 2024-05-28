import { type Request, type Response, type NextFunction } from 'express'
import { HttpException } from '../utils/HttpException'

const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction): void => {
	if (error instanceof HttpException) {
		res.status(error.status).send({
			status: 'fail',
			message: error.message,
			data: error.data
		})
		return
	}

	res.status(500).send({
		status: 'error',
		message: 'Internal Server Error',
		data: error.message
	})
}

export default errorHandler
