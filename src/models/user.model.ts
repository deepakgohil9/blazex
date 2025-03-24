import { pgTable, uuid, varchar, boolean, timestamp } from 'drizzle-orm/pg-core'
import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm'

export const users = pgTable('users', {
  id: uuid().defaultRandom().primaryKey().notNull(),
  name: varchar(),
  email: varchar().unique().notNull(),
  emailVerified: boolean().default(false).notNull(),
  image: varchar().notNull(),
  createdAt: timestamp({ mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp({ mode: 'date' }).$onUpdate(() => new Date()).notNull()
})

export type User = Omit<InferInsertModel<typeof users>, 'id' | 'createdAt' | 'updatedAt'>
export type UserRow = InferSelectModel<typeof users>
