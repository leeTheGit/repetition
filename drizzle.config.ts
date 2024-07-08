import type { Config } from 'drizzle-kit'
import * as dotenv from 'dotenv'
// import { Resource } from 'sst'

dotenv.config({ path: '.env' })
// const databaseDSN = Resource.DatabaseDSN.value
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set')

export default {
    dialect: 'postgresql',
    schema: './src/lib/db/schema/schema.ts',
    out: './drizzle',
    // driver: 'pg',
    dbCredentials: {
        // connectionString: "postgresql://admin:cehub@localhost:5432/cehub?schema=public",
        //@ts-ignore
        url: process.env.DATABASE_URL,
    },
} satisfies Config
