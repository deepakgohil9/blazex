import asyncHandler, { Req, Res, Nxt } from '../utils/async-handler'
import ApiResponse from '../utils/api-response'
import errors from '../utils/error'
import remotes from '../remotes'
import { authTypes, commonTypes } from '../validations'
import { Locals } from '../utils/locals'
import services from '../services'


export const signUp = asyncHandler(async (req: Req<authTypes.SignUpType>, res: Res, _next: Nxt) => {
  const { email, password } = req.body

  const user = await services.user.createIfNotExists({ email })

  await services.account.setPassword({
    userId: user._id,
    accountId: user._id.toString(),
    password,
  })

  res.send(new ApiResponse(201, 'User account created successfully', user))
})


export const signIn = asyncHandler(async (req: Req<authTypes.SignInType>, res: Res, _next: Nxt) => {
  const { email, password } = req.body

  const user = await services.user.getUserByEmail(email)

  if (!user.emailVerified) {
    throw new errors.Forbidden({
      title: 'Email not verified',
      detail: 'Please verify your email before signing in.'
    })
  }

  const isPasswordCorrect = await services.account.verifyPassword({
    userId: user._id,
    password,
  })

  if (!isPasswordCorrect) {
    throw new errors.Unauthorized({
      title: 'Invalid credentials',
      detail: 'Invalid email or password.'
    })
  }

  const data = await services.session.create({
    userId: user._id,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  })

  res.send(new ApiResponse(200, 'User logged in successfully', data))
})


export const socialSignIn = asyncHandler(async (req: Req<authTypes.SocialSigninType>, res: Res, _next: Nxt) => {
  const provider = req.params.provider

  const identity = await remotes.oidc[provider](req.body)
  const user = await services.user.createIfNotExists({
    name: identity.name,
    email: identity.email,
    image: identity.image
  })

  if (!user.emailVerified) {
    throw new errors.Forbidden({
      title: 'Email not verified',
      detail: 'Please verify your email before signing in.'
    })
  }

  await services.account.linkSocial({
    userId: user._id,
    accountId: identity.accountId,
    provider: provider,
  })

  const data = await services.session.create({
    userId: user._id,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  })

  res.send(new ApiResponse(200, 'User logged in successfully', data))
})


export const refreshToken = asyncHandler(async (req: Req<commonTypes.EmptyType>, res: Res, _next: Nxt) => {
  const token = req.get('X-Refresh-Token')

  if (!token) {
    throw new errors.Unauthorized({
      title: 'Refresh token required',
      detail: 'Refresh token not found in the request \'X-Refresh-Token\' header.'
    })
  }

  const accessToken = await services.session.refreshAccessToken(token)

  res.send(new ApiResponse(200, 'Access token refreshed successfully', { accessToken }))
})


export const changePassword = asyncHandler(async (req: Req<authTypes.ChangePasswordType>, res: Res<Locals>, _next: Nxt) => {
  await services.account.updatePassword({ userId: res.locals.user.userId, ...req.body })

  res.send(new ApiResponse(200, 'Password changed successfully'))
})
