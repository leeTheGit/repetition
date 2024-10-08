import { db } from '@repetition/core/lib/db'
import { accounts } from '@repetition/core/lib/db/schema/schema'
import { eq, desc, asc, ne, or, and, like, sql, gt } from 'drizzle-orm'
import { FetchParams } from '@repetition/core/auth/Validators'
import { ModelError, isError } from '@repetition/core/types'
import { AccountEntity as ModelEntity } from '@repetition/core/auth/account/Entity'
import { mapResult } from '@repetition/core/lib'
import UserRepository, {
    SelectTableType as UserTable,
} from '@repetition/core/user/Repository'
import BaseRepository from '@repetition/core/baseRepository'


export type TableType = typeof accounts.$inferSelect
export type CreateTableType = Omit< typeof accounts.$inferInsert, 'id' >


const DEFAULT_LIMIT = 50
const DEFAULT_OFFSET = 0

class Repository extends BaseRepository<
    typeof accounts,
    ModelEntity,
    TableType
> {
    
    constructor() {
        super(accounts, 'accounts')
    }
    // async fetchAll(params: FetchParams = {}): Promise<ModelEntity[]> {
    //     var self = this
    //     const filters: any = []

    //     if (params.organisationUuid) {
    //         filters.push(
    //             eq(this.table.organisationUuid, params.organisationUuid)
    //         )
    //     }

    //     let select = {
    //         id: this.table.id,
    //         organisationUuid: this.table.organisationUuid,
    //         type: this.table.type,
    //         identifier: this.table.identifier,
    //         name: this.table.name,
    //         description: this.table.description,
    //         oneTime: this.table.oneTime,
    //         status: this.table.status,
    //         expires: this.table.expiresAt,
    //     }

    //     const query = db
    //         .select(select)
    //         .from(this.table)
    //         .where(and(...filters))
    //         .limit(params?.limit || DEFAULT_LIMIT)
    //         .offset(params?.offset || DEFAULT_OFFSET)
    //         .$dynamic()

    //     const result = await query

    //     return mapResult<ModelEntity, any>(result, mapToEntity)
    // }

    async fetchByGithubId(githubId: string): Promise<ModelEntity | ModelError>  {
        const account =  await db.query.accounts.findFirst({
            where: and(
                eq(accounts.oauthId, githubId),
                eq(accounts.accountType, 'github')
            ),
            with: {
                user: true
            }
        });
        
        if (!account) {
            return {
                error: `${this.tableName} not found`,
            }
        }

        return this.mapToEntity(account)
    }


    async fetchByGoogleId(oauthId: string): Promise<ModelEntity | ModelError>  {
        const query = db.query.accounts.findFirst({
            where: and(
                eq(accounts.oauthId, oauthId),
                eq(accounts.accountType, 'google')
            ),
            with: {
                user: true
            }
        });
        
        const account = await query;
        if (!account) {
            return {
                error: `${this.tableName} not found`,
            }
        }

        return this.mapToEntity(account)
    }
  
    async handleConstraints(e: any, entity?: ModelEntity): Promise<ModelEntity | ModelError> {

        return {
            error: `Error creating ${this.tableName}`,
        };

    }


    mapToEntity(item: TableType): ModelEntity | ModelError {
        const Entity = ModelEntity.fromValues(item, item.id.toString())
        if (isError(Entity)) {
            return Entity
        }

        if ('user' in item && item.user !== null) {
            const userRepository = new UserRepository()
            const user = userRepository.mapToEntity(
                item.user as UserTable
            )
            if (!isError(user)) {
                Entity.user = user
            }
        }
        return Entity
    }

}

export default Repository
