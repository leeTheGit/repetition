import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import {
    users,
    store,
    product,
    media,
    emails,
    collection,
    emailTemplate,
    roles,
    category,
    billboards,
    order,
    orderItem,
    organisation,
    integration,
    authTokens,
    menu,
    menuItem,
    countries,
} from './schema/schema'
import * as dotenv from 'dotenv'
import Users from './seedData/users'
import Organisations from './seedData/organisations'
import Stores from './seedData/stores'
import Billboards from './seedData/billboards'
import Categories from './seedData/categories'
import Products from './seedData/products'
import Integrations from './seedData/integrations'
import { Orders, OrderItems } from './seedData/orders'
import { Menus, MenuItems } from './seedData/menus'
import { eq } from 'drizzle-orm'
import { createUuid } from '.././utils'
import countryData from './seedData/countries.json'

dotenv.config({ path: '.env' })

export type Organisation = typeof organisation.$inferSelect | []

export const seed = async () => {
    console.log('Seed start')

    const dsn = process.env.DATABASE_URL

    if (!dsn) throw new Error('DATABASE_DSN not found on .env.development')

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

    console.log('adding store')
    const newStore = await db
        .insert(store)
        .values(Stores(usrs, newOrganisations))
        .returning()

    for (let store of newStore) {
        await db
            .insert(authTokens)
            .values({
                organisationUuid: store.organisationUuid,
                storeUuid: store.uuid,
                type: 'organisation',
                identifier: 'admin',
                name: 'Default',
                description: 'Default organisation api token',
                token:
                    store.slug === 'borderland'
                        ? '14399d64-8718-46f8-ad15-15e7afe5d995'
                        : createUuid(),
                status: true,
            })
            .returning()

        console.log('THE STORE', store)
        console.log('adding billboards')
        const newBillboards = await db
            .insert(billboards)
            .values(Billboards(store.uuid))
            .returning()

        console.log('adding categories')
        const categories = await db
            .insert(category)
            .values(Categories(store.uuid, newBillboards))
            .returning()

        console.log('adding categories')
        const integrations = await db
            .insert(integration)
            .values(Integrations(store.uuid, store.organisationUuid))
            .returning()

        console.log('adding products')
        const newProducts = await db
            .insert(product)
            .values(Products(store.uuid, categories))
            .returning()

        console.log('adding orders')
        const newOrders = await db
            .insert(order)
            .values(Orders(store.uuid, store.organisationUuid))
            .returning()

        for (let orderr of newOrders) {
            //@ts-ignore  newProducts type issue with variants column
            const items = OrderItems(orderr.uuid, newProducts)
            try {
                const newOrderItems = await db
                    .insert(orderItem)
                    .values(items)
                    .returning()
            } catch (e) {
                console.log('Error adding order items', e)
            }
            const updateOrders = await db
                .update(order)
                .set({ itemCount: items.length })
                .where(eq(order.uuid, orderr.uuid))
        }

        console.log('adding menus')
        let newMenus = await db.insert(menu).values(Menus(store)).returning()

        for (let menu of newMenus) {
            const m = MenuItems(menu.uuid, categories, newProducts)
            const newMenuItems = await db.insert(menuItem).values(m).returning()
        }
    }

    client.end()
}

const truncate = async (db: NodePgDatabase<Record<string, never>>) => {
    await db.delete(countries)
    await db.delete(order)
    await db.delete(billboards)
    await db.delete(product)
    await db.delete(collection)
    await db.delete(category)
    await db.delete(media)
    await db.delete(emails)
    await db.delete(emailTemplate)
    

    await db.delete(integration)
    await db.delete(authTokens)
    await db.delete(store)
    await db.delete(roles)


    await db.delete(users)
    await db.delete(menuItem)
    await db.delete(menu)
    await db.delete(organisation)
}

seed()
