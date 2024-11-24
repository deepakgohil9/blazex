import asyncHandler, { Req, Res, Nxt } from '../utils/async-handler'
import ApiResponse from '../utils/api-response'
import * as errors from '../utils/error.util'
import config from '../configs/config'

import { authTypes, commonTypes } from '../validations'
import { authService, tokenService, userService } from '../services'
import { googleAuth } from '../remotes'


export const register = asyncHandler(async (req: Req<authTypes.RegisterType>, res: Res, _next: Nxt) => {
  const { email, password } = req.body
  const user = await userService.createUser({ email, password })
  const tokens = tokenService.generateTokens({ id: user._id, email: user.email })
  res.status(201).send(new ApiResponse(201, 'User created successfully', { user, tokens }))
})


export const login = asyncHandler(async (req: Req<authTypes.LoginType>, res: Res, _next: Nxt) => {
  const { email, password } = req.body
  const user = await authService.login(email, password)
  const tokens = tokenService.generateTokens({ id: user._id, email: user.email })
  res.send(new ApiResponse(200, 'User logged in successfully', { user, tokens }))
})


export const refreshToken = asyncHandler((req: Req<commonTypes.EmptyType>, res: Res, _next: Nxt) => {
  const refreshToken = req.headers['x-refresh-token'] as string | undefined
  if (!refreshToken) {
    throw new errors.Unauthorized({
      title: 'No token provided',
      detail: `Unauthorized: No refresh token provided, Please login to get a refresh token`
    })
  }

  const payload = tokenService.verifyToken('refresh', refreshToken)
  const accessToken = tokenService.genrateAccessToken(payload)
  const tokens = { accessToken, refreshToken }
  res.send(new ApiResponse(200, 'Token refreshed successfully.', { tokens }))
})


export const googleSignIn = asyncHandler(async (_req: Req<commonTypes.EmptyType>, res: Res, _next: Nxt) => {
  const url = googleAuth.generateAuthUrl()
  res.send(new ApiResponse(200, 'Google auth url generated successfully.', { url }))
})


export const googleSignInCallback = asyncHandler(async (req: Req<authTypes.GoogleCallbackType>, res: Res, _next: Nxt) => {
  const { code } = req.query
  const googleUser = await googleAuth.getUserData(code)
  if (!googleUser) {
    throw new errors.Unauthorized({
      title: 'Google authentication failed.',
      detail: 'Google authentication failed, please try again.'
    })
  }

  const user = await userService.findOrCreateUser({ email: googleUser.email!, signInMethod: 'google' })
  const { accessToken, refreshToken } = tokenService.generateTokens({ id: user._id, email: user.email })
  res.redirect(`${config.authRedirectUrl}?accessToken=${accessToken}&refreshToken=${refreshToken}`)
})
