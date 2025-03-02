import { users } from '../models'
import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core'
import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm'

export const sessions = pgTable('sessions', {
  id: uuid().defaultRandom().primaryKey().notNull(),
  userId: uuid().references(() => users.id).notNull(),
  token: varchar().unique().notNull(),
  expiresAt: timestamp({ mode: 'date' }).notNull(),
  ipAddress: varchar(),
  userAgent: varchar(),
  createdAt: timestamp({ mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp({ mode: 'date' }).$onUpdate(() => new Date()).notNull()
})

export type Session = Omit<InferInsertModel<typeof sessions>, 'id' | 'createdAt' | 'updatedAt'>
export type SessionRow = InferSelectModel<typeof sessions>
