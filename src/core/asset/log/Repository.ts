import { db } from '@/lib/db'
import { eq, or, like, desc, and, sql } from 'drizzle-orm'
import { assetLog } from '@/lib/db/schema/schema'
import { AssetLogEntity as ModelEntity } from '@/core/asset/log/Entity'

import { FetchParams } from '@/core/asset/log/Validators'
import { mapResult } from '@/lib'
import { ModelError, isError } from '@/core/types'

export type TableType = typeof assetLog.$inferSelect
export type TablePostType = typeof assetLog.$inferInsert

export type CreateTableType = Omit<TablePostType, 'id' | 'uuid'>

const DEFAULT_LIMIT = 50
const DEFAULT_OFFSET = 0

class AssetLogRepository {
    private table = assetLog
    private tableIndex = 'assetLog'
    private tableName = 'Asset Log'

    async fetchAll(params: FetchParams = {}): Promise<ModelEntity[]> {
        const filters: any = []
        if (params?.organisationId) {
            filters.push(eq(this.table.organisationUuid, params.organisationId))
        }

        const query = db
            .select()
            .from(this.table)
            .where(and(...filters))
            .limit(params?.limit || DEFAULT_LIMIT)
            .offset(params?.offset || DEFAULT_OFFSET)
            .$dynamic()

        // if (params?.organisation) {
        //     await withOrganisation(query, params.organisation);
        // }

        const result = await query

        return mapResult<ModelEntity, any>(result, this.mapToEntity)
    }

    async fetchByUuid(
        uuid: string,
        params: FetchParams = {}
    ): Promise<ModelEntity | ModelError> {
        const filters: any = []
        if (params?.organisationId) {
            filters.push(eq(this.table.organisationUuid, params.organisationId))
        }

        let query = db.query.assetLog.findFirst({
            where: and(eq(this.table.uuid, uuid), ...filters),
        })

        // console.log(query.toSQL());

        let asset = await query

        if (!asset) {
            return {
                error: 'Asset not found',
            }
        }

        return this.mapToEntity(asset)
    }

    async fetchCount(params: FetchParams = {}): Promise<number> {
        let count = 0

        const filters: any = []

        const query = db
            .select({
                count: sql<number>`cast(count(${this.table.uuid}) as int)`,
            })
            .from(this.table)
            .where(and(...filters))

        const [result] = await query

        if (result.count) {
            count = result.count
        }

        return count
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

    async save(entity: ModelEntity): Promise<ModelEntity | ModelError> {
        var saved
        const data = entity.data()

        if (entity.isNew()) {
            try {
                ;[saved] = await db.insert(this.table).values(data).returning()
            } catch (e: any) {
                return {
                    error: e.message,
                }
            }
        } else {
            try {
                saved = await db
                    .update(this.table)
                    .set(data)
                    .where(eq(this.table.uuid, entity.uuid))
                    .returning()
            } catch (e: any) {
                console.log('error', e)
                return {
                    error: e.message,
                }
            }
        }

        if (!saved) {
            return {
                error: `${this.tableName} not created`,
            }
        }
        return entity
    }

    // async update(
    //     id: string,
    //     data: Partial<TableType>
    // ): Promise<string | ModelError> {
    //     if (Object.keys(data).length === 0) {
    //         return {
    //             error: `Nothing to update`,
    //         }
    //     }
    //     try {
    //         var updated = await db
    //             .update(this.table)
    //             .set({ ...data })
    //             .where(eq(this.table.uuid, id))

    //         if (updated.rowCount === 0) {
    //             return {
    //                 error: `${this.tableName} not updated`,
    //             }
    //         }
    //     } catch (e: any) {
    //         return {
    //             error: e.message,
    //         }
    //     }

    //     return `${this.tableName} updated`
    // }

    // try {
    //     [saved] = await db.insert(this.table)
    //         .values(data)
    //         .returning();

    // } catch (e:any) {
    //     if (e.constraint === "product_slug_idx") {
    //         entity.uniqueSlug();
    //         return this.save(entity);
    //     }
    //     return this.productErrors(e);
    // }

    async delete(storeId: string, id: string): Promise<string | ModelError> {
        try {
            let del = await db
                .delete(this.table)
                .where(
                    and(
                        eq(this.table.uuid, id),
                    )
                )

            if (del.rowCount === 0) {
                return {
                    error: `${this.tableName} not deleted`,
                }
            }
        } catch (e: any) {
            // if (e.constraint === 'product_image_uuid_media_uuid_fk') {
            //     return {
            //         error: `Cannot delete asset as it's associated with a product`,
            //     }
            // }

            return {
                error: e.message,
            }
        }

        return 'Deleted'
    }

    async deleteByPrimary(
        mediaId: string,
        resource: string,
        resourceId: string
    ): Promise<string | ModelError> {
        try {
            let del = await db
                .delete(this.table)
                .where(
                    and(
                        eq(this.table.mediaUuid, mediaId),
                        eq(this.table.resource, resource),
                        eq(this.table.resourceUuid, resourceId)
                    )
                )

            if (del.rowCount === 0) {
                return {
                    error: `${this.tableName} not deleted`,
                }
            }
        } catch (e: any) {
            // if (e.constraint === 'product_image_uuid_media_uuid_fk') {
            //     return {
            //         error: `Cannot delete asset as it's associated with a product`,
            //     }
            // }

            return {
                error: e.message,
            }
        }

        return 'Deleted'
    }

    mapToEntity(item: TableType): ModelEntity | ModelError {
        if (!item) {
            return {
                error: 'Asset mapping data not found',
            }
        }

        const Entity = ModelEntity.fromValues(item, item.uuid)

        if (isError(Entity)) {
            return Entity
        }

        return Entity
    }
}

export default AssetLogRepository
