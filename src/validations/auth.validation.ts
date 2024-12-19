import z from 'zod'


export const signUp = z.object({
  query: z.object({}).strict(),
  params: z.object({}).strict(),
  body: z.object({
    email: z
      .string({ required_error: 'Field `email` is required for registration, please provide a valid email address' })
      .email('Field `email` must be a valid email address, please provide a valid email address'),
    password: z
      .string({ required_error: 'Field `password` is required for registration, please choose a password for your account' })
      .min(6, 'Field `password` must be at least 6 characters long, please choose a longer password')
      .max(100, 'Field `password` must be at most 100 characters long, please choose a shorter password'),
  }).strict(),
})
export type SignUpType = z.infer<typeof signUp>


export const signIn = z.object({
  query: z.object({}).strict(),
  params: z.object({}).strict(),
  body: z.object({
    email: z
      .string({ required_error: 'Field `email` is required for SignIn, please provide a valid email address' })
      .email('Field `email` must be a valid email address, please provide a valid email address'),
    password: z
      .string({ required_error: 'Field `password` is required for SignIn, please provide the password for your account' })
      .min(6, 'Field `password` must be at least 6 characters long, please provide a longer password')
      .max(100, 'Field `password` must be at most 100 characters long, please provide a shorter password'),
  }).strict(),
})
export type SignInType = z.infer<typeof signIn>


export const googleCallback = z.object({
  query: z.object({
    code: z
      .string({ required_error: 'Field `code` is required for google callback.' })
  }),
  params: z.object({}).strict(),
  body: z.object({}).strict(),
})
export type GoogleCallbackType = z.infer<typeof googleCallback>


export const changePassword = z.object({
  query: z.object({}).strict(),
  params: z.object({}).strict(),
  body: z.object({
    password: z
      .string({ required_error: 'Field `password` is required to change password, please provide your current password' })
      .min(6, 'Field `password` must be at least 6 characters long, please provide a longer password')
      .max(100, 'Field `password` must be at most 100 characters long, please provide a shorter password'),
    newPassword: z
      .string({ required_error: 'Field `newPassword` is required to change password, please choose a new password' })
      .min(6, 'Field `newPassword` must be at least 6 characters long, please choose a longer password')
      .max(100, 'Field `newPassword` must be at most 100 characters long, please choose a shorter password'),
  }).strict(),
})
export type ChangePasswordType = z.infer<typeof changePassword>
