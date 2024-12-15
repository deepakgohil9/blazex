import jwt from 'jsonwebtoken'
import type { Request, Response, NextFunction } from 'express'
import config from '../configs/config'
import errors from '../utils/error'
import { Locals } from '../utils/locals'


/** Middleware to verify the access token and set the user data in the locals */
const auth = (req: Request, res: Response, next: NextFunction): void => {
  // Get the access token from the Authorization header
  const accessToken = req.get('Authorization')?.replace(/^Bearer\s/, '')

  // If no access token is provided, throw an error
  if (!accessToken) {
    throw new errors.Unauthorized({
      title: 'Unauthorized',
      detail: 'No access token provided. Please make sure to you are logged in.'
    })
  }

  try {
    // Verify the access token
    const decoded = jwt.verify(accessToken, config.token.access.publicKey)
    res.locals = {
      ...res.locals,
      user: decoded as Locals['user']
    }
    next()
  } catch (_error) {
    next(new errors.Unauthorized({
      title: 'Unauthorized',
      detail: 'Invalid access token. Please make sure to you are logged in.'
    }))
  }
}

export default auth
