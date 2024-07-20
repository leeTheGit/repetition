import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres'
import { passwordHash } from '@repetition/core/lib/auth/hash'
import { Pool } from 'pg'
import {Slugify} from '@repetition/core/lib/utils'
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
// import Users from './seedData/users'
// import Organisations from './seedData/organisations'
// import Categories from './seedData/categories'
// import Problems from './seedData/problems'
import { eq } from 'drizzle-orm'

dotenv.config({ path: '.env' })

export type Organisation = typeof organisation.$inferSelect | []

export const seed = async () => {
    console.log('Seed start')

    const dsn = process.env.DATABASE_URL

    if (!dsn) throw new Error('DATABASE_DSN not found on .env')

    const client = new Pool({
        connectionString: dsn,
        max: 1,
    })

    const db = drizzle(client)

    // Delete all data from the database
    await truncate(db)
    // client.end();
    // return;


    const [newuser] = await db
        .insert(users)
        .values({
            uuid: "5adfc196-3415-4251-b1d9-8c58ab8bb151",
            firstname: "Tester",
            lastname: "McLovin",
            username: "zzxxzztest-tester",
            hashedPassword: await passwordHash('111111'),
            email: "test@zzxxzztest.com",
        })
        .returning({ uuid: users.uuid })


    let newOrganisations: { uuid: string }[] = []


    const [orgg] = await db
        .insert(organisation)
        .values({       
            name: "zzxxzztest-Testing Organisation",
            domain: "testing-org"
        })
        .returning({ uuid: organisation.uuid })
    newOrganisations.push(orgg)

    var updated = await db
        .update(users)
        .set({
            organisationUuid: newOrganisations[0].uuid,
            updatedAt: new Date(),
        })
        .where(eq(users.uuid, newuser.uuid))
    
    
  

    await db
        .insert(authTokens)
        .values({
            organisationUuid: newOrganisations[0].uuid,
            type: 'user',
            identifier: 'admin',
            name: 'Default',
            description: 'Default organisation api token',
            token: '14399d64-8718-46f8-ad15-15e7afe5d995',
            status: true,
        })
        .returning()


    client.end()
}

const truncate = async (db: NodePgDatabase<Record<string, never>>) => {
    // await db.delete(countries)
    // await db.delete(problem)
    // await db.delete(course)
    // await db.delete(collection)
    // await db.delete(category)
    // await db.delete(media)
    // await db.delete(emails)
    // await db.delete(emailTemplate)
    

    // await db.delete(authTokens)
    // await db.delete(roles)


    // await db.delete(users)
    // await db.delete(organisation)
}

seed()
