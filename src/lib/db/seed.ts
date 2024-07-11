import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import {Slugify} from '@/lib/utils'
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
import Users from './seedData/users'
import Organisations from './seedData/organisations'
import Categories from './seedData/categories'
import Problems from './seedData/problems'
import { eq } from 'drizzle-orm'
import { createUuid } from '.././utils'
import countryData from './seedData/countries.json'

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

    for (let i = 0; i < countryData.length; i++) {
        //@ts-ignore
        const update = await db.insert(countries).values(countryData[i])
    }

    const usrs = await Users()

    const [newuser] = await db
        .insert(users)
        .values(usrs)
        .returning({ uuid: users.uuid })

    const orgs = Organisations(newuser.uuid)

    let orgCount = 0

    let newOrganisations: { uuid: string }[] = []

    for (let usr of usrs) {
        const [orgg] = await db
            .insert(organisation)
            .values(orgs[orgCount])
            .returning({ uuid: organisation.uuid })
        newOrganisations.push(orgg)

        var updated = await db
            .update(users)
            .set({
                organisationUuid: newOrganisations[orgCount].uuid,
                updatedAt: new Date(),
            })
            .where(eq(users.uuid, usr.uuid))
        orgCount++
    }
    console.log(newOrganisations)
    const [newCourse] = await db
        .insert(course)
        .values({
            name: "Algorithms",
            organisationUuid: newOrganisations[0].uuid,
            slug: Slugify("Algorithms")
        })
        .returning({ uuid: course.uuid })
    
    console.log("NEW COURSE", newCourse)
    // await db
    //     .insert(authTokens)
    //     .values({
    //         organisationUuid: store.organisationUuid,
    //         storeUuid: store.uuid,
    //         type: 'organisation',
    //         identifier: 'admin',
    //         name: 'Default',
    //         description: 'Default organisation api token',
    //         token:
    //             store.slug === 'borderland'
    //                 ? '14399d64-8718-46f8-ad15-15e7afe5d995'
    //                 : createUuid(),
    //         status: true,
    //     })
    //     .returning()

    console.log('adding categories')
    const categories = await db
        .insert(category)
        .values(Categories())
        .returning()

    let categoryObj:{[key: string]: string} = {}
    for (let category of categories) {
        categoryObj[category.slug] = category.uuid
    }

    console.log(categoryObj)
    console.log(newCourse)
    // console.log(Problems(categoryObj, newCourse.uuid))
    // console.log('adding products')
    const newProblems = await db
        .insert(problem)
        .values(Problems(categoryObj, newCourse.uuid))
        .returning()


    client.end()
}

const truncate = async (db: NodePgDatabase<Record<string, never>>) => {
    await db.delete(countries)
    await db.delete(problem)
    await db.delete(course)
    await db.delete(collection)
    await db.delete(category)
    await db.delete(media)
    await db.delete(emails)
    await db.delete(emailTemplate)
    

    await db.delete(authTokens)
    await db.delete(roles)


    await db.delete(users)
    await db.delete(organisation)
}

seed()
