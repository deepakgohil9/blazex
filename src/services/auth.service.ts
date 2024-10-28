import { UserDoc, User } from '../models'
import * as errors from '../utils/error.util'

export const login = async (email: string, password: string): Promise<Omit<UserDoc, 'password' | 'comparePassword'>> => {
  const user = await User.findOne({ email })
  if (!user || !(await user.comparePassword(password))) {
    throw new errors.Unauthorized({
      title: 'Invalid credentials',
      detail: 'The email address or password you have entered is incorrect. Please try again.'
    })
  }

  const { password: _, ...userData } = user.toObject()
  return userData
}
