import { db } from '@repetition/core/lib/db'
import { users, media } from '@repetition/core/lib/db/schema/schema'
import { eq, desc, asc, and, ilike } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'

import { FetchParams, EntitySchema } from '@repetition/core/user/Validators'
import { ModelError, isError } from '@repetition/core/types'
import { UserEntity as ModelEntity } from '@repetition/core/user/Entity'
import { PgSelect } from 'drizzle-orm/pg-core'
import { mapResult } from '@repetition/core/lib'
import BaseRepository from '../baseRepository'
import AssetRepository, {
    TableType as AssetTable,
} from '@repetition/core/asset/AssetRepository'

export type SelectTableType = typeof users.$inferSelect

const DEFAULT_LIMIT = 50
const DEFAULT_OFFSET = 0

class Repository extends BaseRepository<
    typeof users,
    ModelEntity,
    SelectTableType
> {
    constructor() {
        super(users, 'User')
    }

    async fetchAll(params: FetchParams): Promise<ModelEntity[]> {
        var self = this

        const filters: any = []

        if (params?.email) {
            filters.push(ilike(self.table.email, `%${params.email}%`))
        }

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

        const profileImage = alias(media, 'profileImage')
        const query = db
            .select({
                id: self.table.id,
                uuid: self.table.uuid,
                organisationUuid: self.table.organisationUuid,
                username: self.table.username,
                firstname: self.table.firstname,
                lastname: self.table.lastname,
                email: self.table.email,
                status: self.table.status,
                isDeleted: self.table.isDeleted,
                isTwoFactorEnabled: self.table.isTwoFactorEnabled,
                lastLoggedin: self.table.lastLoggedin,
                createdAt: self.table.createdAt,
                updatedAt: self.table.updatedAt,
                image: self.table.image,
                emailVerified: self.table.emailVerified,
                hashedPassword: self.table.hashedPassword,
                rememberToken: self.table.rememberToken,
                profileImageId: self.table.profileImageId,
                profileImage,
            })
            .from(this.table)
            .leftJoin(
                profileImage,
                eq(self.table.profileImageId, profileImage.uuid)
            )
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
        const data = await db.query.users.findFirst({
            where: eq(this.table.uuid, uuid),
            with: {
                profileImage: true,
            },
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

    async fetchByEmail(
        email: string,
        params: FetchParams = {}
    ): Promise<ModelEntity | ModelError> {
        const filters: any = []
        if (params?.organisationId) {
            filters.push(eq(this.table.organisationUuid, params.organisationId))
        }

        const data = await db.query['users'].findFirst({
            where: and(eq(this.table.email, email), ...filters),
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

    // Generally we return a result mapped to an entity.  For auth we want
    // to compare the user's password and entities don't contain sensitive data
    // this method is for auth only and doens't map the result and will include
    // the hashed password
    async fetchByEmail_forAuth(
        email: string
    ): Promise<EntitySchema | ModelError> {
        const data = await db.query['users'].findFirst({
            where: eq(this.table.email, email),
        })

        if (!data) {
            return {
                error: `${this.tableName} not found`,
            }
        }

        return data
    }

    handleConstraints(e: any, entity?: ModelEntity) {}

    mapToEntity(item: EntitySchema): ModelEntity | ModelError {
        const Entity = ModelEntity.fromValues(item, item.uuid)
        if (isError(Entity)) {
            return Entity
        }
        if ('profileImage' in item && item.profileImage !== null) {
            const assetRepository = new AssetRepository()
            const asset = assetRepository.mapToEntity(
                item.profileImage as AssetTable
            )
            if (!isError(asset)) {
                Entity.profileImage = asset
            }
        }
        // console.log(Entity)

        return Entity
    }
}

export default Repository
