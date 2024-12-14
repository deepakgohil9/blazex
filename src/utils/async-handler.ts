/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Request, Response, NextFunction } from 'express'

interface RequestType {
  body: object
  params: object
  query: object
}


/**
 * Request type for asynHandler funtion
 *
 * @template T - Request type containing params, body and query, Pass the type of zod schema used for validation
 */
export type Req<T extends RequestType> = Request<
  T['params'],
  Record<string, unknown>,
  T['body'],
  T['query']
>

/**
 * Response type for asynHandler function
 *
 * @template K - Response Locals type, Default is Record<string, any>
 */
export type Res<K extends Record<string, any> = Record<string, any>> = Response<any, K>

/**
 * Next function type for asynHandler function
 */
export type Nxt = NextFunction

/**
 * Async handler function type
 *
 * @template T - Request type containing params, body and query, Pass the type of zod schema used for validation
 * @template K - Response Locals type
 */
type AsyncHandler<T extends RequestType, K extends Record<string, any>> = (
  req: Req<T>,
  res: Res<K>,
  next: Nxt
) => void | Promise<void>

/**
 * Async handler function that catches any error and passes it to next function
 *
 * @template T - Request type containing params, body and query, Pass the type of zod schema used for validation
 * @template K - Response Locals type
 * @param fn - Request Handler function that takes request, response and next function as arguments and returns void or Promise<void>
 * @returns - Request Handler function that takes request, response and next function as arguments and returns void.
 */
const asyncHandler = <T extends RequestType, K extends Record<string, any>>(fn: AsyncHandler<T, K>): AsyncHandler<T, K> => {
  return (req: Req<T>, res: Res<K>, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next)	// eslint-disable-line @typescript-eslint/use-unknown-in-catch-callback-variable
  }
}

export default asyncHandler
