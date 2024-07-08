import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import {
    users,
    store,
    product,
    media,
    category,
    billboards,
    order,
    orderItem,
    organisation,
    authTokens,
    menu,
    menuItem,
} from './schema/schema'
import * as dotenv from 'dotenv'
import { eq, like } from 'drizzle-orm'

dotenv.config({ path: '.env' })

export const clean = async () => {
    console.log('Test cleanup')

    const dsn = process.env.DATABASE_URL

    if (!dsn) throw new Error('DATABASE_DSN not found on .env.development')

    const client = new Pool({
        connectionString: dsn,
        max: 1,
    })

    const db = drizzle(client)

    let del = await db
        .delete(product)
        .where(like(product.slug, `zzxxzztest-headphones%`))

    client.end()
}

clean()
