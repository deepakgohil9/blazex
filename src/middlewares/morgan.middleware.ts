import morgan from 'morgan'
import type { Request, Response } from 'express'

import logger from '../configs/logger'

export const successHandler = morgan('dev', {
	skip: (req: Request, res: Response) => res.statusCode >= 400,
	stream: { write: (message) => logger.info(message.trim()) }
})

export const failureHandler = morgan('dev', {
	skip: (req: Request, res: Response) => res.statusCode < 400,
	stream: { write: (message) => logger.error(message.trim()) }
})
