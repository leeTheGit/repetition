import { db } from '@/lib/db'
import { collection } from '@/lib/db/schema/schema'
import { eq, desc, asc, ne, or, and, like } from 'drizzle-orm'
import { FetchParams } from '@/core/collections/Validators'
import { ModelError, isError } from '@/core/types'
import { CollectionEntity as ModelEntity } from '@/core/collections/Entity'
import BaseRepository from '@/core/baseRepository'

// import BillboardRepository, { TableType as BillboardTable } from "@/core/billboard/BillboardRepository"
import { PgSelect } from 'drizzle-orm/pg-core'
import { mapResult } from '@/lib'

export type TableType = typeof collection.$inferSelect
export type CreateTableType = Omit<
    typeof collection.$inferInsert,
    'id' | 'uuid' | 'createdAt' | 'updatedAt'
>

const DEFAULT_LIMIT = 50
const DEFAULT_OFFSET = 0

class Repository extends BaseRepository<
    typeof collection,
    ModelEntity,
    TableType
> {
    constructor() {
        super(collection, 'Collection')
    }

    // private table = collection
    // private tableName = 'Collection'

    async fetchAll(params: FetchParams = {}): Promise<ModelEntity[]> {
        var self = this

        function withOrder<T extends PgSelect>(qb: T, order: string) {
            if (order === 'asc') {
                return qb.orderBy(asc(self.table.id))
            } else {
                return qb.orderBy(desc(self.table.id))
            }
        }

        const filters: any = []
        if (params?.storeId) {
            filters.push(eq(self.table.storeUuid, params.storeId))
        }

        const query = db
            .select()
            .from(this.table)
            .where(and(...filters))
            .limit(params?.limit || DEFAULT_LIMIT)
            .offset(params?.offset || DEFAULT_OFFSET)
            .orderBy(desc(this.table.createdAt))
            .$dynamic()

        if (params?.order) {
            await withOrder(query, params.order)
        }

        const result = await query

        return mapResult<ModelEntity, any>(result, this.mapToEntity)
    }

    private fetchOne(
        id: string,
        col: string = 'uuid',
        params: FetchParams = {}
    ) {
        const filters: any = []
        if (params?.storeId) {
            filters.push(eq(this.table.storeUuid, params.storeId))
        }

        const query = db.query['collection'].findFirst({
            where: and(
                //@ts-ignore
                eq(this.table[col], id),
                ...filters
            ),
        })
        return query
    }

    async fetchByUuid(
        uuid: string,
        params: FetchParams = {}
    ): Promise<ModelEntity | ModelError> {
        const data = await this.fetchOne(uuid, 'uuid', params)
        if (!data) {
            return {
                error: `${this.tableName} not found`,
            }
        }
        return this.mapToEntity(data)
    }

    async fetchBySlug(
        slug: string,
        params: FetchParams = {}
    ): Promise<ModelEntity | ModelError> {
        const data = await this.fetchOne(slug, 'slug', params)
        if (!data) {
            return {
                error: `${this.tableName} not found`,
            }
        }
        return this.mapToEntity(data)
    }

    handleConstraints(e: any, entity?: ModelEntity) {
        // if (e.constraint === 'product_category_uuid_category_uuid_fk') {
        //     return {
        //         error: 'Cannot delete category as it has associated products',
        //     }
        // }
    }

    mapToEntity(item: TableType): ModelEntity | ModelError {
        const Entity = ModelEntity.fromValues(item, item.uuid)

        if (isError(Entity)) {
            return Entity
        }

        return Entity
    }
}

export default Repository
