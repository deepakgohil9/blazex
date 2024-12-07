import mongoose from 'mongoose'

export interface IVerification {
  userId: mongoose.Types.ObjectId
  token: string
  expiresAt: Date
}

export interface VerificationDoc extends IVerification {
  _id: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const verificationSchema = new mongoose.Schema<VerificationDoc>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
}, { timestamps: true })

export const Verification = mongoose.model<VerificationDoc>('Verification', verificationSchema)
