'use server'
import { db } from '@repetition/core/lib/db'
// import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres'
// import { Pool } from 'pg'
import { eq } from 'drizzle-orm'

import {
    store,
    product,
    media,
    category,
    billboards,
    order,
    orderItem,
    organisation,
    menu,
    menuItem,
} from '../schema/schema'

import StoreRepository from '@repetition/core/store/Repository'
import Billboards from '../seedData/billboards'
import Categories from '../seedData/categories'
import Products from '../seedData/products'
import { Orders, OrderItems } from '../seedData/orders'
import { Menus, MenuItems } from '../seedData/menus'
// import { createUuid } from '@repetition/core/lib/utils'
import { isError } from '@repetition/core/types'
// import { Value } from '@radix-ui/react-select'

const storeRepository = new StoreRepository()
// interface Props {
//   storeId: string
// }
export const seedStore = async (storeId: string) => {
    const store = await storeRepository.fetchByUuid(storeId)

    if (isError(store)) {
        return {
            error: 'Store not found',
        }
    }

    let newBillboards: any
    let categories: any
    let newOrders: any
    let newProducts: any
    let newMenus: any

    try {
        newBillboards = await db
            .insert(billboards)
            .values(Billboards(store.uuid))
            .returning()
    } catch (e: any) {
        return {
            error: e.message,
        }
    }

    console.log('adding categories')
    try {
        categories = await db
            .insert(category)
            .values(Categories(store.uuid, newBillboards))
            .returning()
    } catch (e: any) {
        return {
            error: e.message,
        }
    }

    console.log('adding products')
    try {
        newProducts = await db
            .insert(product)
            .values(Products(store.uuid, categories))
            .returning()
    } catch (e: any) {
        return {
            error: e.message,
        }
    }

    console.log('adding orders')
    newOrders = await db
        .insert(order)
        .values(Orders(store.uuid, store.organisationUuid))
        .returning()

    for (let orderr of newOrders) {
        //@ts-ignore  newProducts type issue with variants column
        const items = OrderItems(orderr.uuid, newProducts)
        try {
            await db.insert(orderItem).values(items).returning()
        } catch (e) {
            console.log('Error adding order items', e)
        }
        // add the number of oder items to the order table
        await db
            .update(order)
            .set({ itemCount: items.length })
            .where(eq(order.uuid, orderr.uuid))
    }

    console.log('adding menus')
    try {
        newMenus = await db
            .insert(menu)
            .values(Menus(store.toObject()))
            .returning()
    } catch (e: any) {
        return {
            error: e.message,
        }
    }

    for (let menu of newMenus) {
        const m = MenuItems(menu.uuid, categories, newProducts)
        await db.insert(menuItem).values(m).returning()
    }

    return true
}
