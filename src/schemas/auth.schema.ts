import { object, string, type TypeOf } from 'zod'

export const AuthSchema = object({
	body: object({
		email: string({
			required_error: 'Email is required'
		}).email({
			message: 'Invalid email!'
		}),
		password: string({
			required_error: 'Password is required'
		})
	}).strict(),
	query: object({}).strict(),
	params: object({}).strict()
})

export type AuthSchemaType = TypeOf<typeof AuthSchema>
