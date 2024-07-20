import { db } from '@repetition/core/lib/db'
import { roles } from '@repetition/core/lib/db/schema/schema'
import { eq, desc, asc, and, ilike } from 'drizzle-orm'

import { FetchParams, EntitySchema } from '@repetition/core/user/roles/Validators'
import { ModelError, isError } from '@repetition/core/types'
import { RoleEntity as ModelEntity } from '@repetition/core/user/roles/Entity'
import { PgSelect } from 'drizzle-orm/pg-core'
import { mapResult } from '@repetition/core/lib'
import BaseRepository from '@repetition/core/baseRepository'

export type SelectTableType = typeof roles.$inferSelect

const DEFAULT_LIMIT = 50
const DEFAULT_OFFSET = 0

class Repository extends BaseRepository<
    typeof roles,
    ModelEntity,
    SelectTableType
> {
    constructor() {
        super(roles, 'Role')
    }

    async fetchAll(params: FetchParams): Promise<ModelEntity[]> {
        var self = this

        const filters: any = []

        if (params?.organisationId) {
            filters.push(eq(self.table.organisationUuid, params.organisationId))
        }

        function withOrder<T extends PgSelect>(qb: T, order: string) {
            if (order === 'asc') {
                return qb.orderBy(asc(self.table.id))
            } else {
                return qb.orderBy(desc(self.table.id))
            }
        }

        const query = db
            .select({
                id: self.table.id,
                uuid: self.table.uuid,
                organisationUuid: self.table.organisationUuid,
                name: self.table.name,
                slug: self.table.slug,
                description: self.table.description,
                createdAt: self.table.createdAt,
                updatedAt: self.table.updatedAt,
            })
            .from(this.table)
            .limit(params?.limit || DEFAULT_LIMIT)
            .offset(params?.offset || DEFAULT_OFFSET)
            .orderBy(desc(this.table.createdAt))
            .where(and(...filters))
            .$dynamic()

        if (params?.order) {
            withOrder(query, params.order)
        }
        const result = await query
        return mapResult<ModelEntity, any>(result, this.mapToEntity)
    }

    async fetchByUuid(
        uuid: string,
        params: FetchParams = {}
    ): Promise<ModelEntity | ModelError> {
        const data = await db.query.roles.findFirst({
            where: eq(this.table.uuid, uuid),
        })

        if (!data) {
            return {
                error: `${this.tableName} not found`,
            }
        }
        const entity = this.mapToEntity(data)
        if (isError(entity)) {
            return entity
        }

        return entity
    }

    async fetchBySlug(
        slug: string,
        params: FetchParams = {}
    ): Promise<ModelEntity | ModelError> {
        const data = await db.query['roles'].findFirst({
            where: eq(this.table.slug, slug),
        })

        if (!data) {
            return {
                error: `${this.tableName} not found`,
            }
        }

        const entity = this.mapToEntity(data)
        if (isError(entity)) {
            return entity
        }

        return entity
    }

    handleConstraints(e: any, entity?: ModelEntity) {}

    mapToEntity(item: EntitySchema): ModelEntity | ModelError {
        const Entity = ModelEntity.fromValues(item, item.uuid)
        if (isError(Entity)) {
            return Entity
        }

        return Entity
    }
}

export default Repository
