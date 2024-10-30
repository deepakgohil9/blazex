import { UserLeanDoc } from '../models'
import * as errors from '../utils/error.util'
import { userService } from '../services'

export const login = async (email: string, password: string): Promise<Omit<UserLeanDoc, 'password'>> => {
  const user = await userService.getUserByEmail(email)
  if (!(await user.comparePassword(password))) {
    throw new errors.Unauthorized({
      title: 'Invalid credentials',
      detail: 'The email address or password you have entered is incorrect. Please try again.'
    })
  }

  const { password: _, ...userData } = user.toObject<UserLeanDoc>()
  return userData
}
