import { OAuth2Client } from 'google-auth-library'

const clientId = process.env.GOOGLE_CLIENT_ID
const clientSecret = process.env.GOOGLE_CLIENT_SECRET
const redirectUri = process.env.GOOGLE_REDIRECT_URI
const scopes = [
	'https://www.googleapis.com/auth/userinfo.profile',
	'https://www.googleapis.com/auth/userinfo.email'
]

export interface GoogleUserInfo {
	id: string
	email: string
	verified_email: boolean
	name: string
	given_name: string
	family_name: string
	picture: string
	locale: string
}

const client = new OAuth2Client(clientId, clientSecret, redirectUri)

export const getAuthUrl = (state?: string | undefined): string => {
	return client.generateAuthUrl({
		access_type: 'offline',
		scope: scopes,
		state
	})
}

export const getUserData = async (code: string): Promise<GoogleUserInfo | null> => {
	try {
		const { tokens } = await client.getToken(code)
		client.setCredentials(tokens)
		const response = await client.request({ url: 'https://www.googleapis.com/oauth2/v1/userinfo' })

		if (response.status !== 200) { return null }

		return response.data as GoogleUserInfo
	} catch (error) {
		return null
	}
}
