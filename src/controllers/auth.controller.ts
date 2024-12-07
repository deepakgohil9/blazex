import asyncHandler, { Req, Res, Nxt } from '../utils/async-handler'
import ApiResponse from '../utils/api-response'
import * as errors from '../utils/error'

import { googleAuth } from '../remotes'
import { authTypes, commonTypes } from '../validations'
import { userService, accountService, sessionService } from '../services'


export const signUp = asyncHandler(async (req: Req<authTypes.SignUpType>, res: Res, _next: Nxt) => {
  const { email, password } = req.body

  const user = await userService.createIfNotExists(email)

  await accountService.setPassword({
    userId: user._id,
    accountId: user._id.toString(),
    password,
  })

  res.send(new ApiResponse(201, 'User account created successfully', user))
})


export const signIn = asyncHandler(async (req: Req<authTypes.SignInType>, res: Res, _next: Nxt) => {
  const { email, password } = req.body

  const user = await userService.getUserByEmail(email)

  const isPasswordCorrect = await accountService.verifyPassword({
    userId: user._id,
    password,
  })

  if (!isPasswordCorrect) {
    throw new errors.Unauthorized({
      title: 'Invalid credentials',
      detail: 'Invalid email or password.'
    })
  }

  const data = await sessionService.create({
    userId: user._id,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  })

  res.send(new ApiResponse(200, 'User logged in successfully', data))
})


export const googleSignIn = asyncHandler(async (req: Req<commonTypes.EmptyType>, res: Res, _next: Nxt) => {
  const url = googleAuth.generateAuthUrl()
  res.send(new ApiResponse(200, 'Google sign-in URL generated successfully', { url }))
})


export const googleCallback = asyncHandler(async (req: Req<authTypes.GoogleCallbackType>, res: Res, _next: Nxt) => {
  const { code } = req.query

  const tokens = await googleAuth.getToken(code)
  const googleUser = await googleAuth.getUser(tokens)

  const user = await userService.createIfNotExists(googleUser.email)
  await accountService.linkSocial({
    userId: user._id,
    accountId: googleUser.sub,
    provider: 'google',
  })

  const data = await sessionService.create({
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

  const accessToken = await sessionService.refreshAccessToken(token)

  res.send(new ApiResponse(200, 'Access token refreshed successfully', { accessToken }))
})
