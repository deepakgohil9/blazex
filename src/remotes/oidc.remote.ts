import _ from 'lodash'
import z from 'zod'
import google from 'google-auth-library'
import config from '../configs/config'
import errors from '../utils/error'

const identitySchema = z.object({
  accountId: z.string({ required_error: 'Field `accountId` is required for identity, accountId not received from the provider' }),
  name: z.string({ required_error: 'Field `name` is required for identity, name not received from the provider' }),
  email: z.string({ required_error: 'Field `email` is required for identity, email not received from the provider' }),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  image: z.string().optional()
})
export type Identity = z.infer<typeof identitySchema>
export interface OidcInput {
  code: string
  codeVerifier: string
}

const googleClient = new google.OAuth2Client(_.omit(config.google, 'scopes'))

export default {
  /**
   * Get the identity from the Google OpenID Connect (OIDC) provider using the authorization code with PKCE flow.
   *
   * @param data The input data to get the identity from the Google OIDC provider.
   * @returns The identity of the user.
   */
  google: async (data: OidcInput): Promise<Identity> => {
    // Get the tokens from the authorization code and code verifier.
    const { tokens } = await googleClient.getToken({
      code: data.code,
      codeVerifier: data.codeVerifier,
      client_id: config.google.clientId
    })

    // Verify the ID token from the tokens.
    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token ?? '',
      audience: config.google.clientId
    })

    // Get the payload of ID token.
    const payload = ticket.getPayload()
    if (!payload) {
      throw new errors.InternalServerError({
        title: 'Google OAuth2 token verification failed',
        detail: 'The token payload is empty.'
      })
    }

    // Parse the payload to the identity schema and return the identity.
    return identitySchema.parse({
      name: payload.name,
      email: payload.email,
      firstName: payload.given_name,
      lastName: payload.family_name,
      image: payload.picture,
      accountId: payload.sub
    })
  }
}
