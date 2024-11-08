import type { Request, Response, NextFunction } from 'express'

import { NotFound } from '../utils/error.util'

const notFound = (req: Request, res: Response, next: NextFunction) => {
  next(new NotFound({
    title: 'Resource not found',
    detail: `Cannot ${req.method} ${req.originalUrl} because it does not exist`,
  }))
}

export default notFound
