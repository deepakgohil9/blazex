import pg from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'
import config from '../configs/config'

const pool = new pg.Pool({
  connectionString: config.postgres.uri
})

/** Create a new instance of the database */
export const db = drizzle(pool)

/** Disconnect from Postgres database */
export const disconnect = async () => {
  await pool.end()
}

/** Exporting database instance as default */
export default db

