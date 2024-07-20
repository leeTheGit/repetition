'use server'
import { db } from '@repetition/core/lib/db'
import { and, eq } from 'drizzle-orm'

import {
    store,
    product,
    category,
    billboards,
    order,
    menu,
} from '../schema/schema'
import StoreRepository from '@repetition/core/store/Repository'
import { isError } from '@repetition/core/types'

const storeRepository = new StoreRepository()

export const removeStoreSeed = async (storeId: string) => {
    const StoreEntity = await storeRepository.fetchByUuid(storeId)
    if (isError(StoreEntity)) {
        return {
            error: 'Store not found',
        }
    }
    const delBillboards = await db
        .delete(billboards)
        .where(
            and(
                eq(billboards.storeUuid, StoreEntity.uuid),
                eq(billboards.isSeeded, true)
            )
        )

    const delOrders = await db
        .delete(order)
        .where(
            and(eq(order.storeUuid, StoreEntity.uuid), eq(order.isSeeded, true))
        )

    const delMenus = await db
        .delete(menu)
        .where(
            and(eq(menu.storeUuid, StoreEntity.uuid), eq(menu.isSeeded, true))
        )

    const delProducts = await db
        .delete(product)
        .where(
            and(
                eq(product.storeUuid, StoreEntity.uuid),
                eq(product.isSeeded, true)
            )
        )

    const delCategories = await db
        .delete(category)
        .where(
            and(
                eq(category.storeUuid, StoreEntity.uuid),
                eq(category.isSeeded, true)
            )
        )

    await db
        .update(store)
        .set({ isNew: false })
        .where(eq(store.uuid, StoreEntity.uuid))

    return
}
