import type { Request, Response, NextFunction } from 'express'
import { AppError } from '../utils/error.util'

const errorHandler = (error: Error, req: Request, res: Response, _next: NextFunction) => {
	if (error instanceof AppError) {
		res.status(error.status).send({
			type: error.type,
			title: error.title,
			status: error.status,
			code: error.code,
			detail: error.detail,
			instance: req.originalUrl,
			timestamp: new Date().toISOString(),
		})
		return
	}

	res.send(500).send({
		type: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/500',
		title: 'Internal Server Error',
		status: 500,
		code: 'internal_server_error',
		detail: error.message,
		instance: req.originalUrl,
		timestamp: new Date().toISOString(),
	})
}

export default errorHandler
