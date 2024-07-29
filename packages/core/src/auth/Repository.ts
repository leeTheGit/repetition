import { db } from '@repetition/core/lib/db'
import { authTokens } from '@repetition/core/lib/db/schema/schema'
import { eq, desc, asc, ne, or, and, like, sql, gt } from 'drizzle-orm'
import { FetchParams } from '@repetition/core/auth/Validators'
import { ModelError, isError } from '@repetition/core/types'
import { TokenEntity as ModelEntity } from '@repetition/core/auth/Entity'
import { mapResult } from '@repetition/core/lib'
import UserRepository from '@repetition/core/user/Repository'
export type TableType = typeof authTokens.$inferSelect
export type CreateTableType = Omit<
    typeof authTokens.$inferInsert,
    'id' | 'createdAt' | 'updatedAt'
>

export function mapToEntity(item: TableType) {
    const Entity = new ModelEntity(
        {
            id: item.id,
            organisationUuid: item.organisationUuid,
            type: item.type,
            identifier: item.identifier,
            name: item.name,
            token: item.token,
            description: item.description || '',
            status: item.status,
            oneTime: item.oneTime,
            expiresAt: item.expiresAt,
            createdAt: item.createdAt,
        },
        item.id.toString()
    )

    return Entity
}

const DEFAULT_LIMIT = 50
const DEFAULT_OFFSET = 0

class Repository {
    private table = authTokens
    private tableName = 'authTokens'

    async fetchAll(params: FetchParams = {}): Promise<ModelEntity[]> {
        var self = this
        const filters: any = []

        if (params.organisationUuid) {
            filters.push(
                eq(this.table.organisationUuid, params.organisationUuid)
            )
        }

        let select = {
            id: this.table.id,
            organisationUuid: this.table.organisationUuid,
            type: this.table.type,
            identifier: this.table.identifier,
            name: this.table.name,
            description: this.table.description,
            oneTime: this.table.oneTime,
            status: this.table.status,
            expires: this.table.expiresAt,
        }

        const query = db
            .select(select)
            .from(this.table)
            .where(and(...filters))
            .limit(params?.limit || DEFAULT_LIMIT)
            .offset(params?.offset || DEFAULT_OFFSET)
            .$dynamic()

        const result = await query

        return mapResult<ModelEntity, any>(result, mapToEntity)
    }

    async fetchByToken(
        uuid: string,
        fetchParams: FetchParams = {}
    ): Promise<ModelEntity | ModelError> {
        const data = await db.query['authTokens'].findFirst({
            where: eq(this.table.token, uuid),
        })

        if (!data) {
            return {
                error: `${this.tableName} not found`,
            }
        }

        const entity = mapToEntity(data)

        if ('withIdentity' in fetchParams) {
            if (data.type === 'user') {
                const userRepository = new UserRepository()
                const user = await userRepository.fetchByUuid(data.identifier)
                if (!isError(user)) {
                    entity.user = user
                }
            }
            // BELOW NOT COMPLETEED
            // if (data.type === 'organisation') {
            //     const orgRepository = new OrganisationRepository()
            //     const org = await orgRepository.fetchByUuid(data.identifier)
            //     if (!isError(user)) {
            //         entity.organisation = org
            //     }
            // }
        }

        return entity
    }

    async fetchById(
        id: number,
        params: FetchParams = {}
    ): Promise<ModelEntity | ModelError> {
        const filters: any = []

        if (params.organisationUuid) {
            filters.push(
                eq(this.table.organisationUuid, params.organisationUuid)
            )
        }

        const data = await db.query['authTokens'].findFirst({
            where: and(eq(this.table.id, id), ...filters),
        })

        if (!data) {
            return {
                error: `${this.tableName} not found`,
            }
        }

        return mapToEntity(data)
    }


    async getPasswordResetToken(token: string): Promise<ModelEntity | ModelError> {
        const existingToken = await db.query.authTokens.findFirst({
          where: and(
            eq(authTokens.token, token),
            eq(authTokens.type, 'password-reset'),
            gt(authTokens.expiresAt, sql`now()`)
          )
        });
        if (!existingToken) {
            return {
                error: `${this.tableName} not found`,
            }
        }
        return mapToEntity(existingToken) 
      }




    async fetchByOrganisationUuid(
        uuid: string
    ): Promise<ModelEntity | ModelError> {
        const data = await db.query['authTokens'].findFirst({
            where: eq(this.table.organisationUuid, uuid),
        })

        if (!data) {
            return {
                error: `${this.tableName} not found`,
            }
        }

        return mapToEntity(data)
    }

    async create(values: CreateTableType): Promise<ModelEntity | ModelError> {
        const [created] = await db.insert(this.table).values(values).returning()
        if (!created) {
            return {
                error: `${this.tableName} not created`,
            }
        }

        return mapToEntity(created)
    }

    async update(
        id: number,
        data: Partial<TableType>
    ): Promise<string | ModelError> {
        if (Object.keys(data).length === 0) {
            return {
                error: `Nothing to update`,
            }
        }

        var updated = await db
            .update(this.table)
            .set({ ...data })
            .where(eq(this.table.id, id))

        if (updated.rowCount === 0) {
            return {
                error: `${this.tableName} not updated`,
            }
        }

        return `${this.tableName} updated`
    }

    async delete(id: number): Promise<string | ModelError> {
        let del = await db.delete(this.table).where(and(eq(this.table.id, id)))

        if (del.rowCount === 0) {
            return {
                error: `${this.tableName} not deleted`,
            }
        }

        return 'Deleted'
    }

    async deleteByToken(token: string): Promise<string | ModelError> {
        let del = await db
            .delete(this.table)
            .where(and(eq(this.table.token, token)))

        if (del.rowCount === 0) {
            return {
                error: `${this.tableName} not deleted`,
            }
        }

        return 'Deleted'
    }
}

export default Repository
