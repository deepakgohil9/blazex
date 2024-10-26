import z from 'zod'

const envVarsSchema = z.object({
	NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
	PORT: z.number().default(3000),
	CORS_ORIGIN: z.string().default('*'),
	MONGO_URI: z.string({ required_error: 'MONGO_URI is required in .env' }),
	JWT_ACCESS_SECRET: z.string({ required_error: 'JWT_ACCESS_SECRET is required in .env' }),
	JWT_ACCESS_EXPIRES_IN: z.string({ required_error: 'JWT_ACCESS_EXPIRES_IN is required in .env' }),
	JWT_REFRESH_SECRET: z.string({ required_error: 'JWT_REFRESH_SECRET is required in .env' }),
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
			secret: env.JWT_ACCESS_SECRET,
			expiresIn: env.JWT_ACCESS_EXPIRES_IN
		},
		refresh: {
			secret: env.JWT_REFRESH_SECRET,
			expiresIn: env.JWT_REFRESH_EXPIRES_IN
		}
	}
}
