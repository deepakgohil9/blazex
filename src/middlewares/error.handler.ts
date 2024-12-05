import type { Request, Response, NextFunction } from 'express'
import { AppError } from '../utils/error'
import config from '../configs/config'
import logger from '../configs/logger'

const isInvalidJsonError = (error: Error) => {
  return error instanceof SyntaxError && 'body' in error && (error as Record<string, unknown>).status === 400
}

const errorHandler = (error: Error, req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof AppError) {
    res.setHeader('Content-Type', 'application/problem+json')
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

  if (isInvalidJsonError(error)) {
    res.setHeader('Content-Type', 'application/problem+json')
    res.status(400).send({
      type: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400',
      title: 'Bad Request',
      status: 400,
      code: 'bad_request',
      detail: error.message,
      instance: req.originalUrl,
      timestamp: new Date().toISOString(),
    })
    return
  }

  if (config.env === 'development') {
    logger.error(error)
  }

  res.setHeader('Content-Type', 'application/problem+json')
  res.status(500).send({
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
