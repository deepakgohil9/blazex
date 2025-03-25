import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import _ from 'lodash'
import { eq, lte, gt, and, getTableColumns } from 'drizzle-orm'
import db from '../databases/postgres.database'
import config from '../configs/config'
import errors from '../utils/error'
import { sessions, Session, SessionRow } from '../models'
import services from '../services'

/* Type definitions */
interface Token {
  token: string
  expiresIn: number
}

interface Payload {
  userId: string
  email: string
}

type CreateSessionType = Omit<Session, 'token' | 'expiresAt'>

interface SessionAndTokens {
  session: SessionRow,
  accessToken: Token,
  refreshToken: Token
}



/* Service functions */

/**
 * Delete all expired sessions for the provided userId.
 *
 * @param userId - string representing the user id
 * @returns Promise that resolves to void when the operation is complete
 */
export const deleteExpired = async (userId: string): Promise<void> => {
  await db
    .delete(sessions)
    .where(
      and(
        eq(sessions.userId, userId),
        lte(sessions.expiresAt, new Date()
        )
      )
    )
}


/**
 * Generate a new access token for the provided userId.
 *
 * @param userId - string representing the user id
 * @returns Promise that resolves to the access token
 */
export const generateAccessToken = async (userId: string): Promise<Token> => {
  // Finding the user by userId and preparing the payload
  const data = await services.user.getUserById(userId)
  const payload: Payload = {
    userId: data.id,
    email: data.email
  }

  // Generating the access token
  const accessToken = jwt.sign(payload, config.token.access.privateKey, {
    expiresIn: config.token.access.expiresIn,
    algorithm: 'RS256'
  })

  return { token: accessToken, expiresIn: config.token.access.expiresIn }
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
  const sessionsData = await db
    .insert(sessions)
    .values({
      ...data,
      token: refreshTokenHash,
      expiresAt: new Date(Date.now() + config.token.refresh.expiresIn)
    })
    .returning()

  return {
    session: sessionsData[0],
    accessToken,
    refreshToken: {
      token: refreshToken,
      expiresIn: config.token.refresh.expiresIn
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
  const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex')
  const sessionsData = await db
    .select({
      userId: sessions.userId
    })
    .from(sessions)
    .where(
      and(
        eq(sessions.token, refreshTokenHash),
        gt(sessions.expiresAt, new Date())
      )
    )
    .limit(1)


  // If session was not found, throw an error
  if (!sessionsData[0]) {
    throw new errors.Unauthorized({
      title: 'Invalid refresh token',
      detail: 'Refresh token is invalid or has expired. Please sign in again.'
    })
  }

  // Generate a new access token
  const accessToken = await generateAccessToken(sessionsData[0].userId)
  return accessToken
}


/**
 * Get all active sessions for the provided userId.
 *
 * @param userId - User id
 * @returns Promise that resolves to the sessions
 */
export const getSessions = async (userId: string): Promise<Omit<SessionRow, 'token'>[]> => {
  // Delete all expired sessions
  await deleteExpired(userId)

  // Find all active sessions
  // const sessions = await Session.find({ userId }, { token: 0 }, { lean: true })
  const { token: _token, ...rest } = getTableColumns(sessions)
  const sessionsData = await db
    .select(rest)
    .from(sessions)
    .where(
      eq(sessions.userId, userId),
    )
  return sessionsData
}


/**
 * Revoke the session with the provided id and userId
 *
 * @param data - Session data containing the id and userId
 * @returns Promise that resolves to the revoked session
 * @throws {NotFound} - If session was not found
 */
export const revokeSession = async (data: { id: string, userId: string }): Promise<Omit<SessionRow, 'token'>> => {
  // Delete all expired sessions
  await deleteExpired(data.userId)

  // Delete the session with the provided id and userId
  // const session = await Session.findOneAndDelete(data, { lean: true })
  const sessionsData = await db
    .delete(sessions)
    .where(
      and(
        eq(sessions.id, data.id),
        eq(sessions.userId, data.userId)
      )
    )
    .returning()

  // If session was not found, throw an error
  if (!sessionsData[0]) {
    throw new errors.NotFound({
      title: 'Session not found',
      detail: 'Session not found or has expired.'
    })
  }
  _.unset(sessionsData[0], 'token')
  return sessionsData[0]
}
