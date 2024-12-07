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


export const generateAuthUrl = (): string => {
  return client.generateAuthUrl({
    access_type: 'offline',
    scope: config.google.scopes
  })
}


export const getToken = async (code: string): Promise<Credentials> => {
  const response = await client.getToken(code)
  return response.tokens
}


export const getUser = async (tokens: Credentials): Promise<GoogleUser> => {
  client.setCredentials(tokens)
  const response = await client.request<GoogleUser>({
    url: 'https://www.googleapis.com/oauth2/v3/userinfo'
  })

  return response.data
}
