import { users } from '../models'
import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core'
import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm'

export const accounts = pgTable('accounts', {
  id: uuid().defaultRandom().primaryKey().notNull(),
  userId: uuid().references(() => users.id).notNull(),
  accountId: varchar().notNull(),
  provider: varchar().notNull(),
  accessToken: varchar(),
  refreshToken: varchar(),
  accessTokenExpiresAt: timestamp({ mode: 'date' }),
  refreshTokenExpiresAt: timestamp({ mode: 'date' }),
  scope: varchar(),
  password: varchar(),
  createdAt: timestamp({ mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp({ mode: 'date' }).$onUpdate(() => new Date()).notNull()
})

export type Account = Omit<InferInsertModel<typeof accounts>, 'id' | 'createdAt' | 'updatedAt'>
export type AccountRow = InferSelectModel<typeof accounts>
