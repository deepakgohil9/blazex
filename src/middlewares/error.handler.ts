import type { Request, Response, NextFunction } from 'express'
import errors from '../utils/error'
import config from '../configs/config'
import logger from '../configs/logger'

/**
 * Check if the error is an invalid JSON error
 *
 * @param error - The error to check
 * @returns True if the error is an invalid JSON error, false otherwise
 */
const isInvalidJsonError = (error: Error) => {
  return error instanceof SyntaxError && 'body' in error && (error as Record<string, unknown>).status === 400
}


/**
 * Error handler middleware. This middleware is global error handler for the express application.
 * It sends the error response according to RFC 9457 (https://datatracker.ietf.org/doc/html/rfc9457)
 *
 * @param error - The error
 * @param req - The request object
 * @param res - The response object
 * @param _next - The next middleware
 */
const errorHandler = (error: Error, req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof errors.AppError) {
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
