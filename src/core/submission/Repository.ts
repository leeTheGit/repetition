import { db } from '@/lib/db'
import { submission } from '@/lib/db/schema/schema'
import { eq, desc, asc, ne, or, and, like, sql } from 'drizzle-orm'
import { FetchParams } from '@/core/submission/Validators'
import { ModelError, isError } from '@/core/types'
import { SubmissionEntity as ModelEntity } from '@/core/submission/Entity'
import BaseRepository from '@/core/baseRepository'

// import BillboardRepository, { TableType as BillboardTable } from "@/core/billboard/BillboardRepository"
import { PgSelect } from 'drizzle-orm/pg-core'
import { mapResult } from '@/lib'

export type TableType = typeof submission.$inferSelect
export type CreateTableType = Omit<
    typeof submission.$inferInsert,
    'id' | 'uuid' | 'createdAt' | 'updatedAt'
>

const DEFAULT_LIMIT = 50
const DEFAULT_OFFSET = 0

class Repository extends BaseRepository<
    typeof submission,
    ModelEntity,
    TableType
> {
    constructor() {
        super(submission, 'Submission')
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

        if (params?.userId) {
            filters.push(eq(this.table.userUuid, params.userId ))
        }
        if (params?.problemId) {
            filters.push(eq(this.table.problemUuid, params.problemId ))
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


    async fetchCount(params: FetchParams): Promise<number> {
        let count = 0
        const filters: any = []

        if (params?.userId) {
            filters.push(eq(this.table.userUuid, params.userId ))
        }
        if (params?.problemId) {
            filters.push(eq(this.table.problemUuid, params.problemId ))
        }        
        
        const query = db
            .select({ count: sql`COUNT(*)`.mapWith(Number) })
            .from(this.table)
            .where(and(...filters))

        const [result] = await query

        if (result.count) {
            count = result.count
        }

        return count
    }


    private fetchOne(
        id: string,
        col: string = 'uuid',
        params: FetchParams = {}
    ) {
        const filters: any = []

        const query = db.query['submission'].findFirst({
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
