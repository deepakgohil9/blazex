import { object, type TypeOf } from 'zod'

export const emptySchema = object({
	body: object({}).strict(),
	query: object({}).strict(),
	params: object({}).strict()
})

export type EmptySchemaType = TypeOf<typeof emptySchema>
