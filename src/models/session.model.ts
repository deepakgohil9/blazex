import mongoose from 'mongoose'

export interface ISession {
  userId: mongoose.Types.ObjectId
  token: string
  expiresAt: Date
  ipAddress?: string
  userAgent?: string
}

export interface SessionDoc extends ISession {
  _id: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const sessionSchema = new mongoose.Schema<SessionDoc>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  ipAddress: { type: String },
  userAgent: { type: String },
}, { timestamps: true })

export const Session = mongoose.model<SessionDoc>('Session', sessionSchema)
