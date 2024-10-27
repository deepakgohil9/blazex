import z from 'zod'

const envVarsSchema = z.object({
	NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
	PORT: z.number().default(3000),
	CORS_ORIGIN: z.string().default('*'),
	MONGO_URI: z.string({ required_error: 'MONGO_URI is required in .env' }),
	JWT_ACCESS_PUBLIC_KEY: z.string({ required_error: 'JWT_ACCESS_PUBLIC_KEY is required in .env' }),
	JWT_ACCESS_PRIVATE_KEY: z.string({ required_error: 'JWT_ACCESS_PRIVATE_KEY is required in .env' }),
	JWT_ACCESS_EXPIRES_IN: z.string({ required_error: 'JWT_ACCESS_EXPIRES_IN is required in .env' }),
	JWT_REFRESH_PUBLIC_KEY: z.string({ required_error: 'JWT_REFRESH_PUBLIC_KEY is required in .env' }),
	JWT_REFRESH_PRIVATE_KEY: z.string({ required_error: 'JWT_REFRESH_PRIVATE_KEY is required in .env' }),
	JWT_REFRESH_EXPIRES_IN: z.string({ required_error: 'JWT_REFRESH_EXPIRES_IN is required in .env' })
})

const env = envVarsSchema.parse(process.env)

export default {
	env: env.NODE_ENV,
	port: env.PORT,
	corsOrigin: env.CORS_ORIGIN,
	mongo: {
		uri: env.MONGO_URI
	},
	jwt: {
		access: {
			publicKey: env.JWT_ACCESS_PUBLIC_KEY,
			privateKey: env.JWT_ACCESS_PRIVATE_KEY,
			expiresIn: env.JWT_ACCESS_EXPIRES_IN
		},
		refresh: {
			publicKey: env.JWT_REFRESH_PUBLIC_KEY,
			privateKey: env.JWT_REFRESH_PRIVATE_KEY,
			expiresIn: env.JWT_REFRESH_EXPIRES_IN
		}
	},
	logDir: 'logs'
}
