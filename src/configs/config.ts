import z from 'zod'

const envVarsSchema = z.object({
  NODE_ENV: z.enum([
    'development',
    'production',
    'test'
  ]).default('development'),
  PORT: z.number().default(3000),
  CORS_ORIGIN: z.string().default('*'),
  MONGO_URI: z.string(),
  JWT_ACCESS_PUBLIC_KEY: z.string(),
  JWT_ACCESS_PRIVATE_KEY: z.string(),
  JWT_ACCESS_EXPIRES_IN: z.string(),
  REFRESH_EXPIRES_IN: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_REDIRECT_URI: z.string(),
}).required()

const env = envVarsSchema.parse(process.env)

export default {
  env: env.NODE_ENV,
  port: env.PORT,
  corsOrigin: env.CORS_ORIGIN,
  logDir: 'logs',
  mongo: {
    uri: env.MONGO_URI
  },
  authRedirectUrl: 'https://httpbin.org/get', // This is a dummy URL, replace it with your actual URL
  token: {
    access: {
      publicKey: env.JWT_ACCESS_PUBLIC_KEY,
      privateKey: env.JWT_ACCESS_PRIVATE_KEY,
      expiresIn: env.JWT_ACCESS_EXPIRES_IN
    },
    refresh: {
      expiresIn: env.REFRESH_EXPIRES_IN
    }
  },
  google: {
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    redirectUri: env.GOOGLE_REDIRECT_URI,
    scopes: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
  }
}
