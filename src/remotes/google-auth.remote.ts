import _ from 'lodash'
import { OAuth2Client, Credentials } from 'google-auth-library'
import config from '../configs/config'

const client = new OAuth2Client(_.omit(config.google, 'scopes'))

export type GoogleUser = {
  sub: string
  name: string
  given_name: string
  family_name: string
  picture: string
  email: string
  email_verified: boolean
}


/**
 * Generates the URL for Google OAuth2 authentication
 *
 * @returns The URL for Google OAuth2 authentication
 */
export const generateAuthUrl = (): string => {
  return client.generateAuthUrl({
    access_type: 'offline',
    scope: config.google.scopes
  })
}


/**
 * Exchanges the code for Google OAuth2 tokens
 *
 * @param code The code received from Google OAuth2 authentication
 * @returns The Google OAuth2 tokens
 */
export const getToken = async (code: string): Promise<Credentials> => {
  const response = await client.getToken(code)
  return response.tokens
}


/**
 * Gets the user information from Google
 *
 * @param tokens The Google OAuth2 tokens
 * @returns The user information
 */
export const getUser = async (tokens: Credentials): Promise<GoogleUser> => {
  client.setCredentials(tokens)
  const response = await client.request<GoogleUser>({
    url: 'https://www.googleapis.com/oauth2/v3/userinfo'
  })

  return response.data
}
