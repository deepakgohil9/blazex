import jwt, { type JwtPayload } from 'jsonwebtoken'

const jwtAccessSecret = process.env.JWT_ACCESS_SECRET ?? ''
const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET ?? ''

export interface jwtPayload extends JwtPayload {
	id: string
}

export interface JwtTokens {
	accessToken: string
	refreshToken: string
}

export const generateTokens = (payload: JwtPayload): JwtTokens => {
	const accessToken = jwt.sign(payload, jwtAccessSecret, { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN })
	const refreshToken = jwt.sign(payload, jwtRefreshSecret, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN })
	return { accessToken, refreshToken }
}

export const verifyToken = (token: string, type: 'access' | 'refresh'): jwtPayload | null => {
	try {
		const secret = type === 'access' ? jwtAccessSecret : jwtRefreshSecret
		const decoded = jwt.verify(token, secret) as jwtPayload
		return decoded
	} catch (error) {
		return null
	}
}

export const generateAccessToken = (payload: JwtPayload): string => {
	return jwt.sign(payload, jwtAccessSecret, { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN })
}
