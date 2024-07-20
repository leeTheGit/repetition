import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import {
    users,
    problem,
    media,
    emails,
    course,
    collection,
    emailTemplate,
    roles,
    category,
    organisation,
    authTokens,
   countries,
} from './schema/schema'
import * as dotenv from 'dotenv'
import { eq, like } from 'drizzle-orm'

dotenv.config({ path: '.env' })

export const clean = async () => {
    console.log('Removing test data')

    const dsn = process.env.DATABASE_URL

    if (!dsn) throw new Error('DATABASE_DSN not found on .env')

    const client = new Pool({
        connectionString: dsn,
        max: 1,
    })

    const db = drizzle(client)

    console.log('removing test data');
    await db
        .delete(category)
        .where(like(category.slug, `zzxxzztest-%`))

    await db
        .delete(problem)
        .where(like(problem.slug, `zzxxzztest-%`))

    await db
        .delete(course)
        .where(like(course.slug, `zzxxzztest-%`))

    await db
        .delete(users)
        .where(eq(users.email, `test@zzxxzztest.com`))

    await db
        .delete(organisation)
        .where(like(organisation.name, `zzxxzztest-%`))

    client.end()
}

clean()
