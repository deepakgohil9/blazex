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


export const socialSignin = z.object({
  query: z.object({}).strict(),
  params: z.object({
    provider: z
      .enum(['google'], { required_error: 'Field `provider` is required for social signin, please provide the provider' })
  }).strict(),
  body: z.object({
    code: z
      .string({ required_error: 'Field `code` is required for social signin, please provide the code' }),
    codeVerifier: z
      .string({ required_error: 'Field `code_verifier` is required for social signin, please provide the code_verifier' })
      .min(43, 'Field `code_verifier` must be at least 43 characters long, please provide a longer code_verifier')
      .max(128, 'Field `code_verifier` must be at most 128 characters long, please provide a shorter code_verifier'),
  }).strict(),
})
export type SocialSigninType = z.infer<typeof socialSignin>


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


export const signOut = z.object({
  query: z.object({}).strict(),
  params: z.object({
    sessionId: z
      .string({ required_error: 'Field `sessionId` is required to sign out, please provide the session id' })
      .min(24, 'Field `sessionId` must be at least 24 characters long, please provide a longer session id')
      .max(24, 'Field `sessionId` must be at most 24 characters long, please provide a shorter session id')
  }).strict(),
  body: z.object({}).strict(),
})
export type SignOutType = z.infer<typeof signOut>
