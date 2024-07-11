import { db } from '@/lib/db'
import { productAssets } from '@/lib/db/schema/schema'
import {
    eq,
    desc,
    asc,
    ne,
    or,
    and,
    like,
    inArray,
    sql,
    gt,
    lt,
    lte,
    gte,
} from 'drizzle-orm'
import { FetchParams } from '@/core/product/Validators'
import { ModelError, isError } from '@/core/types'
import { ProductAssetEntity as ModelEntity } from '@/core/product/ProductAssetEntity'
import { PgSelect } from 'drizzle-orm/pg-core'
import { mapResult } from '@/lib'
// import BaseRepository from "@/core/baseRepository"

export type TableType = typeof productAssets.$inferSelect & {
    image?: { cdnUrl: string } | null
}
export type CreateTableType = Omit<
    TableType,
    'id' | 'uuid' | 'createdAt' | 'updatedAt'
>

const DEFAULT_LIMIT = 50
const DEFAULT_OFFSET = 0

class ProductAssetRepository {
    private table = productAssets
    private tableIndex = 'productAssets'
    private tableName = 'ProductAssets'

    async fetchAll(params: FetchParams): Promise<ModelEntity[]> {
        var self = this

        const filters: any = []

        if (params?.storeId) {
            filters.push(eq(self.table.storeUuid, params.storeId))
        }

        if (typeof params?.productUuids !== 'undefined') {
            filters.push(inArray(self.table.productUuid, params.productUuids))
        }

        function withOrder<T extends PgSelect>(qb: T, order: string) {
            if (order === 'asc') {
                return qb.orderBy(asc(self.table.order))
            } else {
                return qb.orderBy(desc(self.table.order))
            }
        }

        const query = db
            .select({
                storeUuid: this.table.storeUuid,
                productUuid: this.table.productUuid,
                mediaUuid: this.table.mediaUuid,
                order: this.table.order,
            })
            .from(this.table)
            .limit(params?.limit || DEFAULT_LIMIT)
            .offset(params?.offset || DEFAULT_OFFSET)
            .orderBy(asc(this.table.order))
            .where(and(...filters))
            .$dynamic()

        if (params?.order) {
            withOrder(query, params.order)
        }

        const result = await query
        return mapResult<ModelEntity, any>(result, this.mapToEntity)
    }

    async fetchByMediaUuid(
        uuid: string,
        params: FetchParams = {}
    ): Promise<ModelEntity | ModelError> {
        const filters: any = []
        if (params?.storeId) {
            filters.push(eq(this.table.storeUuid, params.storeId))
        }

        if (params?.productId) {
            filters.push(eq(this.table.productUuid, params.productId))
        }

        const query = db.query['productAssets'].findFirst({
            where: and(eq(this.table.mediaUuid, uuid), ...filters),
        })

        const data = await query

        if (!data) {
            return {
                error: `Failed to fetch ${this.tableName}`,
            }
        }

        return this.mapToEntity(data)
    }

    async create(values: CreateTableType): Promise<ModelEntity | ModelError> {
        const [created] = await db.insert(this.table).values(values).returning()
        if (!created) {
            return {
                error: `${this.tableName} not created`,
            }
        }
        return this.mapToEntity(created)
    }

    async reorder(
        productId: string,
        imageId: string,
        data: { from: number; to: number }
    ): Promise<string | ModelError> {
        // we're incrementing the between images and decrementing the main image
        let increment = data.from < data.to

        await db.transaction(async (tx) => {
            // move the images between the from and to points
            if (increment) {
                try {
                    const updated = db
                        .update(this.table)
                        .set({
                            order: sql`${this.table.order} - 1`,
                        })
                        .where(
                            and(
                                eq(this.table.productUuid, productId),
                                gt(this.table.order, data.from),
                                lte(this.table.order, data.to)
                            )
                        )

                    // console.log(updated.toSQL());
                    const result = await updated

                    if (result.rowCount === 0) {
                        await tx.rollback()

                        return {
                            error: `Failed to update order`,
                        }
                    }
                } catch (e) {
                    console.log(e)
                }
            } else {
                // decrement

                const updated = await db
                    .update(this.table)
                    .set({
                        order: sql`${this.table.order} + 1`,
                    })
                    .where(
                        and(
                            eq(this.table.productUuid, productId),
                            gte(this.table.order, data.to),
                            lt(this.table.order, data.from)
                        )
                    )

                if (updated.rowCount === 0) {
                    await tx.rollback()

                    return {
                        error: `Failed to update order`,
                    }
                }
            }

            // move the re-ordered image
            const query = db
                .update(this.table)
                .set({
                    order: data.to,
                })
                .where(
                    and(
                        eq(this.table.mediaUuid, imageId),
                        eq(this.table.productUuid, productId)
                    )
                )
            // console.log(query.toSQL());
            const updated = await query
            if (updated.rowCount === 0) {
                await tx.rollback()

                return {
                    error: `Failed to update order`,
                }
            }
        })

        return 'Reordered'
    }

    async setFeatured(
        productId: string,
        imageId: string
    ): Promise<string | ModelError> {
        await db.transaction(async (tx) => {
            var updated = await db
                .update(this.table)
                .set({ featured: false })
                .where(eq(this.table.productUuid, productId))

            if (updated.rowCount === 0) {
                await tx.rollback()
                return {
                    error: `Failed to reset featured`,
                }
            }

            var updated = await db
                .update(this.table)
                .set({ featured: true })
                .where(
                    and(
                        eq(this.table.productUuid, productId),
                        eq(this.table.mediaUuid, imageId)
                    )
                )

            if (updated.rowCount === 0) {
                await tx.rollback()
                return {
                    error: `Failed to set featured`,
                }
            }
        })

        return `${this.tableName} updated`
    }

    async update(
        productId: string,
        imageId: string,
        data: Partial<TableType>
    ): Promise<string | ModelError> {
        if (
            typeof productId === 'undefined' ||
            productId === '' ||
            typeof imageId === 'undefined' ||
            imageId === ''
        ) {
            throw new Error('Id is required')
        }

        if (Object.keys(data).length === 0) {
            return {
                error: `Nothing to update`,
            }
        }
        var updated = await db
            .update(this.table)
            .set({ ...data })
            .where(
                and(
                    eq(this.table.productUuid, productId),
                    eq(this.table.mediaUuid, imageId)
                )
            )

        if (updated.rowCount === 0) {
            return {
                error: `${this.tableName} not updated`,
            }
        }

        return `${this.tableName} updated`
    }

    async delete(
        productId: string,
        mediaId: string
    ): Promise<string | ModelError> {
        let del = await db
            .delete(this.table)
            .where(
                and(
                    eq(this.table.mediaUuid, mediaId),
                    eq(this.table.productUuid, productId)
                )
            )

        if (del.rowCount === 0) {
            return {
                error: `${this.tableName} not deleted`,
            }
        }

        return 'Deleted'
    }

    async addToAssets(values: {
        storeUuid: string
        productUuid: string
        mediaUuid: string
    }): Promise<string | ModelError> {
        const query = db
            .select({
                order: productAssets.order,
            })
            .from(productAssets)
            .where(
                and(
                    eq(productAssets.productUuid, values.productUuid),
                    eq(productAssets.storeUuid, values.storeUuid)
                )
            )
            .orderBy(desc(productAssets.order))
            .limit(1)

        const result = await query
        const order = result[0]?.order + 1 || 0

        const assetValues = {
            ...values,
            order,
        }

        const created = await db
            .insert(productAssets)
            .values(assetValues)
            .returning()
        if (!created) {
            return {
                error: `Failed to add asset to product assets`,
            }
        }

        return 'Added to assets'
    }

    mapToEntity(item: TableType): ModelEntity | ModelError {
        return ModelEntity.fromValues(item, item.productUuid + item.mediaUuid)
    }
}

export default ProductAssetRepository
