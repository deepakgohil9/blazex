import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/models',
  dbCredentials: {
    url: process.env.POSTGRES_URI || ''
  }
})
