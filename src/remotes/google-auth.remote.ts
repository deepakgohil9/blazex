import _ from 'lodash'
import { OAuth2Client, TokenPayload } from 'google-auth-library'
import config from '../configs/config'

const client = new OAuth2Client(_.omit(config.google, 'scopes'))

export type GoogleUserData = Pick<TokenPayload, 'email' | 'email_verified' | 'name' | 'given_name' | 'family_name' | 'picture'>

export const generateAuthUrl = (): string => {
  return client.generateAuthUrl({
    access_type: 'offline',
    scope: config.google.scopes
  })
}

export const getUserData = async (code: string): Promise<GoogleUserData | null> => {
  try {
    const { tokens } = await client.getToken(code)
    client.setCredentials(tokens)

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token ?? '',
      audience: config.google.clientId
    })

    const payload = ticket.getPayload()
    return _.pick(payload, ['email', 'email_verified', 'name', 'given_name', 'family_name', 'picture'])
  }
  catch (error) {
    return null
  }
}
