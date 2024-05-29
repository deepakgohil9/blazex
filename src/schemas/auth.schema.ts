import { object, string, type TypeOf } from 'zod'

export const authSchema = object({
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

export const issueAccessTokenSchema = object({
	body: object({}).strict(),
	query: object({}).strict(),
	params: object({}).strict()
})

export type AuthSchemaType = TypeOf<typeof authSchema>
export type IssueAccessTokenSchemaType = TypeOf<typeof issueAccessTokenSchema>
