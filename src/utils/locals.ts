import { Types } from 'mongoose'
import { JwtPayload } from 'jsonwebtoken'

export interface Locals extends JwtPayload {
  user: {
    userId: Types.ObjectId
    email: string
  }
}
