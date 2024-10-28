import { ObjectId } from 'mongoose'
import jwt from 'jsonwebtoken'

import * as errors from '../utils/error.util'
import config from '../configs/config'

export interface Payload {
  id: ObjectId,
  email: string
}

export interface Tokens {
  accessToken: string,
  refreshToken: string
}

export const generateTokens = (payload: Payload): Tokens => {
  const accessToken = jwt.sign(payload, config.jwt.access.privateKey, { expiresIn: config.jwt.access.expiresIn, algorithm: 'RS256' })
  const refreshToken = jwt.sign(payload, config.jwt.refresh.privateKey, { expiresIn: config.jwt.refresh.expiresIn, algorithm: 'RS256' })
  return { accessToken, refreshToken }
}

export const genrateAccessToken = (payload: Payload): string => {
  const accessToken = jwt.sign(payload, config.jwt.access.privateKey, { expiresIn: config.jwt.access.expiresIn, algorithm: 'RS256' })
  return accessToken
}

export const verifyToken = (type: 'access' | 'refresh', token?: string): Payload => {
  if (!token) {
    throw new errors.Unauthorized({ title: 'No token provided', detail: `Unauthorized: No ${type} token provided, Please login to get a ${type} token` })
  }
  try {
    const publicKey = config.jwt[type].publicKey
    const decoded = jwt.verify(token, publicKey) as Payload
    return { id: decoded.id, email: decoded.email }
  }
  catch (_error) {
    throw new errors.Unauthorized({ title: 'Invalid token', detail: 'The token you provided is invalid' })
  }
}
