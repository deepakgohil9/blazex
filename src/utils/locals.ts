import { JwtPayload } from 'jsonwebtoken'

export interface Locals extends JwtPayload {
  user: {
    userId: string
    email: string
  }
}
