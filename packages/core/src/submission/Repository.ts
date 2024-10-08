import { db } from '@repetition/core/lib/db'
import { submission } from '@repetition/core/lib/db/schema/schema'
import { eq, desc, asc, ne, or, and, like, sql } from 'drizzle-orm'
import { FetchParams } from '@repetition/core/submission/Validators'
import { ModelError, isError } from '@repetition/core/types'
import { SubmissionEntity as ModelEntity } from '@repetition/core/submission/Entity'
import BaseRepository from '@repetition/core/baseRepository'

// import BillboardRepository, { TableType as BillboardTable } from "@repetition/core/billboard/BillboardRepository"
import { PgSelect } from 'drizzle-orm/pg-core'
import { mapResult } from '@repetition/core/lib'

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

    async handleConstraints(e: any, entity?: ModelEntity): Promise<ModelEntity | ModelError> {

        // if (e.constraint === 'product_category_uuid_category_uuid_fk') {
        //     return {
        //         error: 'Cannot delete category as it has associated products',
        //     }
        // }
        // if (e.constraint === 'category_slug_idx' && entity) {
        //     entity.uniqueSlug()
        //     return this.save(entity)
        // }
        return {
            error: `Error creating ${this.tableName}`,
        };   
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
