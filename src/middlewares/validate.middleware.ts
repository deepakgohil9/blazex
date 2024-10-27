import type { Request, Response, NextFunction, RequestHandler } from 'express'
import z from 'zod'

import { ValidationError } from '../utils/error.util'

type baseType = z.ZodObject<{body: z.AnyZodObject, params: z.AnyZodObject, query: z.AnyZodObject}>

/* eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters */
const validate = <T extends baseType>(schema: T): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    schema.parseAsync({
      body: req.body,	// eslint-disable-line @typescript-eslint/no-unsafe-assignment
      params: req.params,
      query: req.query
    }).then((data: z.infer<T>) => {
      req.body = data.body
      req.params = data.params
      req.query = data.query
      next()
    }).catch((error: unknown) => {
      next(new ValidationError({
        title: 'Invalid Request',
        detail: (error as z.ZodError).errors.map((error) => error.message).join(', ')
      }))
    })
  }
}

export default validate
