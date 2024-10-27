import { ObjectId } from 'mongoose'
import jwt, { type JwtPayload } from 'jsonwebtoken'

import config from '../configs/config'

export interface Payload extends JwtPayload {
	id: ObjectId,
	email: string
}

export interface Tokens {
	accessToken: string,
	refreshToken: string
}

export const generateToken = (payload: Payload): Tokens => {
	const accessToken = jwt.sign(payload, config.jwt.access.privateKey, { expiresIn: config.jwt.access.expiresIn, algorithm: 'RS256' })
	const refreshToken = jwt.sign(payload, config.jwt.refresh.privateKey, { expiresIn: config.jwt.refresh.expiresIn, algorithm: 'RS256' })
	return { accessToken, refreshToken }
}

export const verifyToken = (token: string, type: 'access' | 'refresh'): Payload => {
	const publicKey = config.jwt[type].publicKey
	return jwt.verify(token, publicKey) as Payload
}

export const generateNewAccessToken = (refreshToken: string): Tokens => {
	const payload = verifyToken(refreshToken, 'refresh')
	const accessToken = jwt.sign(payload, config.jwt.access.privateKey, { expiresIn: config.jwt.access.expiresIn, algorithm: 'RS256' })
	return { accessToken, refreshToken }
}
