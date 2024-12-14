import type { Request, Response, NextFunction } from 'express'
import errors from '../utils/error'

const notFound = (req: Request, res: Response, next: NextFunction) => {
  next(new errors.NotFound({
    title: 'Resource not found',
    detail: `Cannot ${req.method} ${req.originalUrl} because it does not exist`,
  }))
}

export default notFound
