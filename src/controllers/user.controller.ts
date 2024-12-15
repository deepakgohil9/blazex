import asyncHandler, { Req, Res, Nxt } from '../utils/async-handler'
import ApiResponse from '../utils/api-response'
import { commonTypes, userTypes } from '../validations'
import { Locals } from '../utils/locals'
import services from '../services'


export const getUser = asyncHandler(async (req: Req<commonTypes.EmptyType>, res: Res<Locals>, _next: Nxt) => {
  const user = await services.user.getUserById(res.locals.user.userId)
  res.send(new ApiResponse(200, 'User fetched successfully', user))
})


export const updateUser = asyncHandler(async (req: Req<userTypes.UpdateUserType>, res: Res<Locals>, _next: Nxt) => {
  const user = await services.user.updateUser(res.locals.user.userId, req.body)
  res.send(new ApiResponse(200, 'User updated successfully', user))
})
