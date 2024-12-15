import z from 'zod'


export const updateUser = z.object({
  query: z.object({}).strict(),
  params: z.object({}).strict(),
  body: z.object({
    name: z
      .string({ required_error: 'Field `name` is required for updating user profile, please provide a valid name' }),
    image: z
      .string({ required_error: 'Field `image` is required for updating user profile, please provide a valid image URL' })
      .url('Field `image` must be a valid URL, please provide a valid image URL'),
  }).strict(),
})
export type UpdateUserType = z.infer<typeof updateUser>
