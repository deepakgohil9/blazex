import asyncHandler, { Req, Res, Nxt } from '../utils/async-handler'
import ApiResponse from '../utils/api-response'
import { authTypes, commonTypes } from '../validations'
import { authService, tokenService, userService } from '../services'

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
  const payload = tokenService.verifyToken('refresh', refreshToken)
  const accessToken = tokenService.genrateAccessToken(payload)
  const tokens = { accessToken, refreshToken }
  res.send(new ApiResponse(200, 'Token refreshed successfully', { tokens }))
})
