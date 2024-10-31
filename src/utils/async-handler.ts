/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Request, Response, NextFunction } from 'express'

interface RequestType {
  body: object
  params: object
  query: object
}

export type Req<T extends RequestType> = Request<T['params'], Record<string, unknown>, T['body'], T['query']>
export type Res<K extends Record<string, any> = Record<string, any>> = Response<any, K>
export type Nxt = NextFunction

const asyncHandler = <T extends RequestType, K extends Record<string, any>>(fn: (req: Req<T>, res: Res<K>, next: NextFunction) => void | Promise<void>): (req: Req<T>, res: Res<K>, next: NextFunction) => void => {
  return (req: Req<T>, res: Res<K>, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next)	// eslint-disable-line @typescript-eslint/use-unknown-in-catch-callback-variable
  }
}

export default asyncHandler
