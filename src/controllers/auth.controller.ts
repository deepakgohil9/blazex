import asyncHandler, { Req, Res, Nxt } from '../utils/async-handler'
import ApiResponse from '../utils/api-response'
import { authTypes } from '../validations'
import { userService, tokenService } from '../services'

export const register = asyncHandler(async (req: Req<authTypes.RegisterType>, res: Res, _next: Nxt) => {
  const { email, password } = req.body
  const user = await userService.createUser({ email, password })
  const tokens = tokenService.generateToken({ id: user._id, email: user.email })
  res.status(201).send(new ApiResponse(201, 'User created successfully', { user, tokens }))
})

