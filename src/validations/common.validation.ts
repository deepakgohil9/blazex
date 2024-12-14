import z from 'zod'


export const empty = z.object({
  query: z.object({}).strict(),
  params: z.object({}).strict(),
  body: z.object({}).strict(),
})
export type EmptyType = z.infer<typeof empty>
