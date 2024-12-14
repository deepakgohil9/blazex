import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import ms from 'ms'
import config from '../configs/config'
import errors from '../utils/error'
import { Session, ISession, SessionDoc } from '../models'
import services from '../services'

/* Type definitions */
type Token = {
  token: string
  expiresIn: number
}
type Payload = {
  userId: string
  email: string
}
type CreateSessionType = Pick<ISession, 'userId' | 'ipAddress' | 'userAgent'>
type SessionAndTokens = { session: SessionDoc, accessToken: Token, refreshToken: Token }



/* Service functions */

/**
 * Delete all expired sessions for the provided userId.
 *
 * @param userId - User id
 * @returns Promise that resolves to void when the operation is complete
 */
export const deleteExpired = async (userId: ISession['userId']): Promise<void> => {
  await Session.deleteMany({
    userId: userId,
    expiresAt: { $lte: new Date() }
  })
}


/**
 * Generate a new access token for the provided userId.
 *
 * @param userId - User id
 * @returns Promise that resolves to the access token
 */
export const generateAccessToken = async (userId: ISession['userId']): Promise<Token> => {
  // Finding the user by userId and preparing the payload
  const user = await services.user.getUserById(userId)
  const payload: Payload = {
    userId: user._id.toString(),
    email: user.email
  }

  // Generating the access token
  const accessToken = jwt.sign(payload, config.token.access.privateKey, {
    expiresIn: config.token.access.expiresIn,
    algorithm: 'RS256'
  })

  return { token: accessToken, expiresIn: ms(config.token.access.expiresIn) }
}


/**
 * Create a new session with the provided data and return the session and tokens.
 *
 * @param data - Session data
 * @returns Promise that resolves to the session and tokens
 */
export const create = async (data: CreateSessionType): Promise<SessionAndTokens> => {
  // Delete all expired sessions
  await deleteExpired(data.userId)

  // Generate a new refresh token and hash it and generate a short-lived access token
  const refreshToken = crypto.randomUUID()
  const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex')
  const accessToken = await generateAccessToken(data.userId)

  // Create a new session with the refresh token hash
  const session = new Session({
    ...data,
    token: refreshTokenHash,
    expiresAt: new Date(Date.now() + ms(config.token.refresh.expiresIn)),
  })
  await session.save()

  return {
    session: session.toObject(),
    accessToken,
    refreshToken: {
      token: refreshToken,
      expiresIn: session.expiresAt.getTime() - Date.now()
    }
  }
}


/**
 * Refresh the access token with the provided refresh token.
 *
 * @param refreshToken
 * @returns Promise that resolves to the access token
 * @throws {Unauthorized} - If refresh token is invalid or has expired
 */
export const refreshAccessToken = async (refreshToken: string): Promise<Token> => {
  // Find the session with the refresh token hash
  const session = await Session.findOne({
    token: crypto.createHash('sha256').update(refreshToken).digest('hex'),
    expiresAt: { $gt: new Date() }
  }, { userId: 1 }, { lean: true })

  // If session was not found, throw an error
  if (!session) {
    throw new errors.Unauthorized({
      title: 'Invalid refresh token',
      detail: 'Refresh token is invalid or has expired. Please sign in again.'
    })
  }

  // Generate a new access token
  const accessToken = await generateAccessToken(session.userId)
  return accessToken
}


/**
 * Get all active sessions for the provided userId.
 *
 * @param userId - User id
 * @returns Promise that resolves to the sessions
 */
export const getSessions = async (userId: ISession['userId']): Promise<SessionDoc[]> => {
  // Delete all expired sessions
  await deleteExpired(userId)

  // Find all active sessions
  const sessions = await Session.find({ userId }, { token: 0 }, { lean: true })
  return sessions
}


/**
 * Revoke the session with the provided refresh token.
 *
 * @param userId - User id
 * @param refreshToken - Refresh token
 * @returns Promise that resolves to void when the operation is complete
 */
export const revokeSession = async (userId: ISession['userId'], refreshToken: string): Promise<void> => {
  // Delete the session with the refresh token hash
  await Session.deleteOne({
    userId,
    token: crypto.createHash('sha256').update(refreshToken).digest('hex')
  })
}
